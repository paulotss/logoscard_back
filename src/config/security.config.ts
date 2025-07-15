import 'dotenv/config';

export const SecurityConfig = {
  // JWT Configuration
  jwt: {
    secret:
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    expirationTime: process.env.JWT_EXPIRATION || '1h',
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // Increased from 100 to 1000
    paymentMaxRequests: parseInt(
      process.env.PAYMENT_RATE_LIMIT_MAX || '100', // Increased from 10 to 100
      10,
    ),
  },

  // Password Security
  password: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
    timeout: parseInt(process.env.SESSION_TIMEOUT || '30', 10) * 60 * 1000, // 30 minutes
  },

  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Content Security Policy
  csp: {
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

  // Request Size Limits
  requestLimits: {
    maxBodySize: '1mb',
    maxParamLength: 100,
    maxHeaderSize: '8kb',
  },

  // Input Validation Rules
  validation: {
    email: {
      maxLength: 255,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    name: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    },
    cpf: {
      pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
    },
    cnpj: {
      pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/,
    },
    phone: {
      areaPattern: /^\d{2}$/,
      numberPattern: /^\d{8,9}$/,
    },
    amount: {
      min: 100, // 1 real in cents
      max: 100000000, // 1 million reals in cents
    },
  },

  // Encryption Configuration
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    sensitiveFields: [
      'password',
      'token',
      'card',
      'encrypted',
      'tax_id',
      'cpf',
      'billing_info',
      'authorization',
      'cookie',
    ],
  },

  // PagBank/PagSeguro Configuration
  pagbank: {
    environment: process.env.PAGSEGURO_ENVIRONMENT || 'sandbox',
    token: process.env.PAGSEGURO_TOKEN,
    appId: process.env.PAGSEGURO_APP_ID,
    publicKey: process.env.PAGSEGURO_PUBLIC_KEY,
    timeout: 30000, // 30 seconds
    retries: 3,
  },

  // Security Headers
  securityHeaders: {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    xXSSProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },

  // Monitoring and Alerting
  monitoring: {
    maxFailedLogins: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    suspiciousActivityThreshold: 10,
    alertOnFailedPayments: true,
  },

  // Feature Flags
  features: {
    enableRecaptcha: process.env.ENABLE_RECAPTCHA === 'true',
    enableTwoFactor: process.env.ENABLE_2FA === 'true',
    enableAuditLog: process.env.ENABLE_AUDIT_LOG === 'true',
    enableRealTimeMonitoring:
      process.env.ENABLE_REAL_TIME_MONITORING === 'true',
  },
};

export default SecurityConfig;
