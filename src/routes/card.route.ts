import { Router } from 'express';
import CardTokenController from '../controllers/card.token.controller';
import AuthHandle from '../middlewares/AuthHandle';
import SecurityMiddleware from '../middlewares/SecurityMiddleware';

const cardRoutes = Router();

// Apply security middleware to all card routes
cardRoutes.use(SecurityMiddleware.paymentRateLimit);

// POST /card/generate-token - Generate a new card token
cardRoutes.post('/generate-token', AuthHandle.authVerify, (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.generateToken();
});

// POST /card/validate-token - Validate a card token
cardRoutes.post('/validate-token', (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.validateToken();
});

// POST /card/use-token - Mark a token as used
cardRoutes.post('/use-token', (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.useToken();
});

// GET /card/tokens - Get user's active tokens (authenticated)
cardRoutes.get('/tokens', AuthHandle.authVerify, (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.getUserTokens();
});

// GET /card/rate-limit - Get rate limit info for current user
cardRoutes.get('/rate-limit', AuthHandle.authVerify, (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.getRateLimitInfo();
});

// Admin routes
// GET /card/admin/token/:token - Get token info (admin only)
cardRoutes.get(
  '/admin/token/:token',
  AuthHandle.authVerify,
  (req, res, next) => {
    const controller = new CardTokenController(req, res, next);
    controller.getTokenInfo();
  },
);

// POST /card/admin/cleanup - Cleanup expired tokens (admin only)
cardRoutes.post('/admin/cleanup', AuthHandle.authVerify, (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.cleanupExpiredTokens();
});

export default cardRoutes;
