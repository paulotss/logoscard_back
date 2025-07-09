import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import ErrorHandle from './middlewares/ErrorHandle';
import SecurityMiddleware from './middlewares/SecurityMiddleware';
import { SecurityConfig } from './config/security.config';
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';
import invoiceRouter from './routes/invoice.route';
import assignmentRouter from './routes/assignment.route';
import benefitRouter from './routes/benefit.route';
import clientRouter from './routes/client.route';
import dependentRouter from './routes/dependent.route';
import depositRouter from './routes/deposit.route';
import withdrawRouter from './routes/withdraw.route';
import pagBankRouter from './routes/pagBank.route';

const app = express();

// Trust proxy for proper IP detection
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: SecurityConfig.csp.directives,
    },
    hsts: SecurityConfig.securityHeaders.hsts,
  }),
);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// CORS Configuration
app.use(
  cors({
    origin: SecurityConfig.cors.allowedOrigins,
    credentials: SecurityConfig.cors.credentials,
    maxAge: SecurityConfig.cors.maxAge,
  }),
);

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: SecurityConfig.rateLimit.windowMs,
  max: SecurityConfig.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: SecurityConfig.requestLimits.maxBodySize }));
app.use(
  express.urlencoded({
    extended: true,
    limit: SecurityConfig.requestLimits.maxBodySize,
  }),
);

// Security Middleware
app.use(SecurityMiddleware.configureCORS);
app.use(SecurityMiddleware.validateContentType);
app.use(SecurityMiddleware.requestSizeLimit);
// app.use(SecurityMiddleware.logRequest);

// Apply payment rate limiting to PagBank routes
app.use('/api/pagbank', SecurityMiddleware.paymentRateLimit);

// Routes
app.use('/api/users', userRouter);
app.use('/api/plans', planRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/benefits', benefitRouter);
app.use('/api/clients', clientRouter);
app.use('/api/dependents', dependentRouter);
app.use('/api/deposits', depositRouter);
app.use('/api/withdraws', withdrawRouter);
app.use('/api/pagbank', pagBankRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Security Headers for all responses
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()',
  );
  next();
});

// Error handling middleware (should be last)
app.use(ErrorHandle.handle);

export default app;
