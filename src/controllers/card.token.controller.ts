import { Request, Response, NextFunction } from 'express';
import CardTokenService from '../services/card.token.service';
import { SecurityUtils } from '../utils/Security';

class CardTokenController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  // Log security events
  private logSecurityEvent(event: string, details: any = {}) {
    const sanitizedDetails = SecurityUtils.maskSensitiveData(details);

    console.log(`[CARD_TOKEN_SECURITY] ${event}`, {
      timestamp: new Date().toISOString(),
      ip: this.request.ip,
      userAgent: this.request.get('User-Agent'),
      userId: this.response.locals.jwt?.payload?.userId,
      ...sanitizedDetails,
    });
  }

  // Generate a new card token
  public async generateToken() {
    try {
      // Check if user is authenticated
      if (!this.response.locals.jwt?.payload) {
        this.logSecurityEvent('GENERATE_TOKEN_NOT_AUTHENTICATED');
        return this.response
          .status(401)
          .json({ error: 'Authentication required' });
      }

      const { userId } = this.request.body;
      const requestingUserId = this.response.locals.jwt.payload.userId;
      const requestingUserAccessLevel =
        this.response.locals.jwt.payload.accessLevel;

      // Input validation
      if (!userId) {
        this.logSecurityEvent('GENERATE_TOKEN_MISSING_USER_ID', {
          requestingUserId,
        });
        return this.response.status(400).json({ error: 'userId is required' });
      }

      // Validate userId is a number
      const targetUserId = parseInt(userId, 10);
      if (Number.isNaN(targetUserId) || targetUserId <= 0) {
        this.logSecurityEvent('GENERATE_TOKEN_INVALID_USER_ID', {
          requestingUserId,
          invalidUserId: userId,
        });
        return this.response
          .status(400)
          .json({ error: 'Valid userId is required' });
      }

      this.logSecurityEvent('GENERATE_TOKEN_ATTEMPT', {
        requestingUserId,
        targetUserId,
        requestingUserAccessLevel,
      });

      // Generate token using service
      const result = await CardTokenService.generateToken(
        requestingUserId,
        targetUserId,
        requestingUserAccessLevel,
      );

      this.logSecurityEvent('GENERATE_TOKEN_SUCCESS', {
        requestingUserId,
        targetUserId,
        tokenLength: result.token.length,
        expiresAt: result.expiresAt,
      });

      // Return success response
      return this.response.status(201).json(result);
    } catch (error: any) {
      this.logSecurityEvent('GENERATE_TOKEN_ERROR', {
        requestingUserId: this.response.locals.jwt?.payload?.userId,
        error: error.message,
      });

      // Handle specific error types
      if (error.statusCode) {
        return this.response
          .status(error.statusCode)
          .json({ error: error.message });
      }

      return this.next(error);
    }
  }

  // Validate a token
  public async validateToken() {
    try {
      const { token } = this.request.body;

      if (!token) {
        this.logSecurityEvent('VALIDATE_TOKEN_MISSING_TOKEN');
        return this.response.status(400).json({ error: 'Token is required' });
      }

      this.logSecurityEvent('VALIDATE_TOKEN_ATTEMPT', {
        tokenLength: token.length,
      });

      const validation = await CardTokenService.validateToken(token);

      if (validation.isValid) {
        this.logSecurityEvent('VALIDATE_TOKEN_SUCCESS', {
          userId: validation.user?.id,
        });

        return this.response.json({
          isValid: true,
          user: validation.user,
          expiresAt: validation.tokenData?.expiresAt,
        });
      }

      this.logSecurityEvent('VALIDATE_TOKEN_INVALID');

      return this.response.json({
        isValid: false,
        message: 'Token is invalid or expired',
      });
    } catch (error: any) {
      this.logSecurityEvent('VALIDATE_TOKEN_ERROR', { error: error.message });
      return this.next(error);
    }
  }

  // Use (mark as used) a token
  public async useToken() {
    try {
      const { token } = this.request.body;

      if (!token) {
        this.logSecurityEvent('USE_TOKEN_MISSING_TOKEN');
        return this.response.status(400).json({ error: 'Token is required' });
      }

      this.logSecurityEvent('USE_TOKEN_ATTEMPT', {
        tokenLength: token.length,
      });

      const success = await CardTokenService.useToken(token);

      if (success) {
        this.logSecurityEvent('USE_TOKEN_SUCCESS');
        return this.response.json({
          message: 'Token marked as used successfully',
        });
      }

      this.logSecurityEvent('USE_TOKEN_FAILED');
      return this.response
        .status(400)
        .json({ error: 'Token is invalid or already used' });
    } catch (error: any) {
      this.logSecurityEvent('USE_TOKEN_ERROR', { error: error.message });
      return this.next(error);
    }
  }

  // Get user's active tokens (requires authentication)
  public async getUserTokens() {
    try {
      if (!this.response.locals.jwt?.payload) {
        this.logSecurityEvent('GET_USER_TOKENS_NOT_AUTHENTICATED');
        return this.response
          .status(401)
          .json({ error: 'Authentication required' });
      }

      const { userId } = this.response.locals.jwt.payload;

      this.logSecurityEvent('GET_USER_TOKENS_ATTEMPT', { userId });

      const tokens = await CardTokenService.getUserTokens(userId);

      this.logSecurityEvent('GET_USER_TOKENS_SUCCESS', {
        userId,
        tokenCount: tokens.length,
      });

      return this.response.json({
        tokens: tokens.map(token => ({
          id: token.id,
          token: `${token.token.substring(0, 8)}...${token.token.substring(
            56,
          )}`, // Masked token
          expiresAt: token.expiresAt,
          createdAt: token.createdAt,
          createdBy: token.creator,
        })),
      });
    } catch (error: any) {
      this.logSecurityEvent('GET_USER_TOKENS_ERROR', {
        userId: this.response.locals.jwt?.payload?.userId,
        error: error.message,
      });
      return this.next(error);
    }
  }

  // Get token info (admin only)
  public async getTokenInfo() {
    try {
      if (!this.response.locals.jwt?.payload) {
        this.logSecurityEvent('GET_TOKEN_INFO_NOT_AUTHENTICATED');
        return this.response
          .status(401)
          .json({ error: 'Authentication required' });
      }

      // Check admin access (accessLevel 0)
      if (this.response.locals.jwt.payload.accessLevel !== 0) {
        this.logSecurityEvent('GET_TOKEN_INFO_INSUFFICIENT_PERMISSIONS', {
          userId: this.response.locals.jwt.payload.userId,
          accessLevel: this.response.locals.jwt.payload.accessLevel,
        });
        return this.response
          .status(403)
          .json({ error: 'Admin access required' });
      }

      const { token } = this.request.params;

      if (!token) {
        this.logSecurityEvent('GET_TOKEN_INFO_MISSING_TOKEN');
        return this.response.status(400).json({ error: 'Token is required' });
      }

      this.logSecurityEvent('GET_TOKEN_INFO_ATTEMPT', {
        adminUserId: this.response.locals.jwt.payload.userId,
        tokenLength: token.length,
      });

      const tokenInfo = await CardTokenService.getTokenInfo(token);

      if (tokenInfo) {
        this.logSecurityEvent('GET_TOKEN_INFO_SUCCESS', {
          adminUserId: this.response.locals.jwt.payload.userId,
          tokenUserId: tokenInfo.userId,
        });

        return this.response.json(tokenInfo);
      }

      this.logSecurityEvent('GET_TOKEN_INFO_NOT_FOUND');
      return this.response.status(404).json({ error: 'Token not found' });
    } catch (error: any) {
      this.logSecurityEvent('GET_TOKEN_INFO_ERROR', {
        adminUserId: this.response.locals.jwt?.payload?.userId,
        error: error.message,
      });
      return this.next(error);
    }
  }

  // Get rate limit info for current user
  public async getRateLimitInfo() {
    try {
      if (!this.response.locals.jwt?.payload) {
        return this.response
          .status(401)
          .json({ error: 'Authentication required' });
      }

      const { userId } = this.response.locals.jwt.payload;
      const rateLimitInfo = CardTokenService.getRateLimitInfo(userId);

      return this.response.json({
        remaining: rateLimitInfo.remaining,
        resetTime: rateLimitInfo.resetTime,
        message: `${rateLimitInfo.remaining} token generations remaining`,
      });
    } catch (error: any) {
      return this.next(error);
    }
  }

  // Cleanup expired tokens (admin only)
  public async cleanupExpiredTokens() {
    try {
      if (!this.response.locals.jwt?.payload) {
        this.logSecurityEvent('CLEANUP_TOKENS_NOT_AUTHENTICATED');
        return this.response
          .status(401)
          .json({ error: 'Authentication required' });
      }

      // Check admin access (accessLevel 0)
      if (this.response.locals.jwt.payload.accessLevel !== 0) {
        this.logSecurityEvent('CLEANUP_TOKENS_INSUFFICIENT_PERMISSIONS', {
          userId: this.response.locals.jwt.payload.userId,
          accessLevel: this.response.locals.jwt.payload.accessLevel,
        });
        return this.response
          .status(403)
          .json({ error: 'Admin access required' });
      }

      this.logSecurityEvent('CLEANUP_TOKENS_ATTEMPT', {
        adminUserId: this.response.locals.jwt.payload.userId,
      });

      const deletedCount = await CardTokenService.cleanupExpiredTokens();

      this.logSecurityEvent('CLEANUP_TOKENS_SUCCESS', {
        adminUserId: this.response.locals.jwt.payload.userId,
        deletedCount,
      });

      return this.response.json({
        message: `Cleaned up ${deletedCount} expired tokens`,
        deletedCount,
      });
    } catch (error: any) {
      this.logSecurityEvent('CLEANUP_TOKENS_ERROR', {
        adminUserId: this.response.locals.jwt?.payload?.userId,
        error: error.message,
      });
      return this.next(error);
    }
  }
}

export default CardTokenController;
