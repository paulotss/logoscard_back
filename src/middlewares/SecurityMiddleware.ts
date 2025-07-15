import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, param, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError';

class SecurityMiddleware {
  // Rate limiting for payment endpoints
  public static paymentRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
      error: 'Too many payment requests, please try again later.',
      retryAfter: 900, // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      // Use IP + user ID if available for more granular limiting
      return req.ip + (req.user?.id || '');
    },
  });

  // Rate limiting for general API endpoints
  public static apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many API requests, please try again later.',
      retryAfter: 900,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Security headers
  public static securityHeaders = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://api.pagseguro.com',
          'https://ws.pagseguro.uol.com.br',
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });

  // Input validation for payment creation
  public static validatePaymentCreation = [
    body('customer.name')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 2, max: 100 }),
    body('customer.email').isEmail().normalizeEmail(),
    body('customer.tax_id')
      .matches(/^\d{11}$|^\d{14}$/)
      .withMessage('Invalid tax ID format'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('Items must be a non-empty array'),
    body('items.*.name').notEmpty().trim().escape(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.unit_amount').isInt({ min: 1 }),
  ];

  // Input validation for plan creation
  public static validatePlanCreation = [
    body('amount')
      .isInt({ min: 100 })
      .withMessage('Amount must be at least 100 cents'),
    body('interval')
      .isIn(['MONTHLY', 'YEARLY'])
      .withMessage('Invalid interval'),
    body('name').notEmpty().trim().escape().isLength({ min: 2, max: 100 }),
    body('description').optional().trim().escape().isLength({ max: 500 }),
    body('reference_id').notEmpty().trim().escape().isLength({ max: 200 }),
  ];

  // Input validation for user creation
  public static validateUserCreation = [
    body('name').notEmpty().trim().escape().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('tax_id')
      .matches(/^\d{11}$/)
      .withMessage('Invalid CPF format'),
    body('phones')
      .isArray({ min: 1 })
      .withMessage('Phones must be a non-empty array'),
    body('phones.*.area')
      .matches(/^\d{2}$/)
      .withMessage('Invalid area code'),
    body('phones.*.number')
      .matches(/^\d{8,9}$/)
      .withMessage('Invalid phone number'),
    body('birth_date').isISO8601().toDate(),
    body('billing_info')
      .isArray({ min: 1 })
      .withMessage('Billing info is required'),
  ];

  // Input validation for signature creation
  public static validateSignatureCreation = [
    body('plan.id').notEmpty().trim().escape(),
    body('customer.id').notEmpty().trim().escape(),
    body('payment_method').isArray({ min: 1 }),
    body('reference_id').notEmpty().trim().escape().isLength({ max: 200 }),
  ];

  // Authentication middleware
  public static authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new CustomError('Access token is required', 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = decoded;

      // Log authentication attempt
      console.log(
        `[AUTH] User ${decoded.id} authenticated for ${req.method} ${req.path}`,
      );

      next();
    } catch (error) {
      console.log(
        `[AUTH] Authentication failed for ${req.method} ${req.path}: ${error.message}`,
      );
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  // Authorization middleware for admin-only endpoints
  public static requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.user?.role !== 'admin') {
      console.log(
        `[AUTH] Admin access denied for user ${req.user?.id} on ${req.method} ${req.path}`,
      );
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  };

  // Request validation middleware
  public static validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(
        `[VALIDATION] Request validation failed for ${req.method} ${req.path}:`,
        errors.array(),
      );
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  };

  // Content type validation
  public static validateContentType = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (
      req.method === 'POST' ||
      req.method === 'PUT' ||
      req.method === 'PATCH'
    ) {
      if (!req.is('application/json')) {
        return res.status(415).json({
          error: 'Content-Type must be application/json',
        });
      }
    }
    next();
  };

  // Request size limit
  public static requestSizeLimit = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const contentLength = req.get('content-length');
    const maxSize = 1024 * 1024; // 1MB

    if (contentLength && parseInt(contentLength) > maxSize) {
      return res.status(413).json({
        error: 'Request body too large',
      });
    }
    next();
  };

  // CORS configuration
  public static configureCORS = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ];
    const origin = req.get('Origin');

    if (allowedOrigins.includes(origin!)) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  };

  // Request logging with security context
  public static logRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const startTime = Date.now();

    console.log(`[REQUEST] ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      contentLength: req.get('content-length'),
    });

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(
        `[RESPONSE] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
      );
    });

    next();
  };

  // Sanitize sensitive data from logs
  public static sanitizeLogData = (data: any): any => {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitive = [
      'password',
      'token',
      'card',
      'encrypted',
      'tax_id',
      'cpf',
      'billing_info',
    ];
    const sanitized = { ...data };

    sensitive.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  };
}

export default SecurityMiddleware;
