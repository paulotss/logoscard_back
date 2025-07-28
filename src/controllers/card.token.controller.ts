import { Request, Response, NextFunction } from 'express';
import CardTokenService from '../services/card.token.service';
import { SecurityUtils } from '../utils/Security'; // Supondo a existência deste utilitário

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
    // ALTERADO: Lendo o userId do local correto (req.user)
    const sanitizedDetails = SecurityUtils.maskSensitiveData(details);

    console.log(`[CARD_TOKEN_SECURITY] ${event}`, {
      timestamp: new Date().toISOString(),
      ip: this.request.ip,
      userAgent: this.request.get('User-Agent'),
      userId: this.request.user?.id, // Corrigido
      ...sanitizedDetails,
    });
  }

  // Generate a new card token
  public async generateToken() {
    try {
      // ALTERADO: A verificação de autenticação agora usa 'this.request.user'
      if (!this.request.user) {
        this.logSecurityEvent('GENERATE_TOKEN_NOT_AUTHENTICATED');
        return this.response.status(401).json({ error: 'Authentication required' });
      }

      const { userId } = this.request.body;
      // ALTERADO: Os dados do usuário logado vêm de 'this.request.user'
      const requestingUserId = this.request.user.id;
      const requestingUserAccessLevel = this.request.user.accessLevel;

      if (!userId) {
        this.logSecurityEvent('GENERATE_TOKEN_MISSING_USER_ID', { requestingUserId });
        return this.response.status(400).json({ error: 'userId is required' });
      }

      const targetUserId = parseInt(userId, 10);
      if (Number.isNaN(targetUserId) || targetUserId <= 0) {
        this.logSecurityEvent('GENERATE_TOKEN_INVALID_USER_ID', { requestingUserId, invalidUserId: userId });
        return this.response.status(400).json({ error: 'Valid userId is required' });
      }

      this.logSecurityEvent('GENERATE_TOKEN_ATTEMPT', { requestingUserId, targetUserId, requestingUserAccessLevel });

      const result = await CardTokenService.generateToken(
        requestingUserId,
        targetUserId,
        requestingUserAccessLevel,
      );

      this.logSecurityEvent('GENERATE_TOKEN_SUCCESS', { requestingUserId, targetUserId, tokenLength: result.token.length, expiresAt: result.expiresAt });

      return this.response.status(201).json(result);
    } catch (error: any) {
      this.logSecurityEvent('GENERATE_TOKEN_ERROR', { requestingUserId: this.request.user?.id, error: error.message });
      if (error.statusCode) {
        return this.response.status(error.statusCode).json({ error: error.message });
      }
      return this.next(error);
    }
  }

  // Validate a token (lógica original mantida, pois não depende de autenticação)
  public async validateToken() {
    try {
      const { token } = this.request.body;
      if (!token) {
        this.logSecurityEvent('VALIDATE_TOKEN_MISSING_TOKEN');
        return this.response.status(400).json({ error: 'Token is required' });
      }
      this.logSecurityEvent('VALIDATE_TOKEN_ATTEMPT', { tokenLength: token.length });
      const validation = await CardTokenService.validateToken(token);
      if (validation.isValid) {
        this.logSecurityEvent('VALIDATE_TOKEN_SUCCESS', { userId: validation.user?.id });
        return this.response.json({ isValid: true, user: validation.user, expiresAt: validation.tokenData?.expiresAt });
      }
      this.logSecurityEvent('VALIDATE_TOKEN_INVALID');
      return this.response.json({ isValid: false, message: 'Token is invalid or expired' });
    } catch (error: any) {
      this.logSecurityEvent('VALIDATE_TOKEN_ERROR', { error: error.message });
      return this.next(error);
    }
  }

  // Use (mark as used) a token (lógica original mantida)
  public async useToken() {
    try {
      const { token } = this.request.body;
      if (!token) {
        this.logSecurityEvent('USE_TOKEN_MISSING_TOKEN');
        return this.response.status(400).json({ error: 'Token is required' });
      }
      this.logSecurityEvent('USE_TOKEN_ATTEMPT', { tokenLength: token.length });
      const success = await CardTokenService.useToken(token);
      if (success) {
        this.logSecurityEvent('USE_TOKEN_SUCCESS');
        return this.response.json({ message: 'Token marked as used successfully' });
      }
      this.logSecurityEvent('USE_TOKEN_FAILED');
      return this.response.status(400).json({ error: 'Token is invalid or already used' });
    } catch (error: any) {
      this.logSecurityEvent('USE_TOKEN_ERROR', { error: error.message });
      return this.next(error);
    }
  }

  // Get user's active tokens (requires authentication)
  public async getUserTokens() {
    try {
      // ALTERADO: A verificação agora é feita em 'this.request.user'
      if (!this.request.user) {
        this.logSecurityEvent('GET_USER_TOKENS_NOT_AUTHENTICATED');
        return this.response.status(401).json({ error: 'Authentication required' });
      }
      
      // ALTERADO: Pega o userId do lugar correto
      const userId = this.request.user.id;

      this.logSecurityEvent('GET_USER_TOKENS_ATTEMPT', { userId });
      const tokens = await CardTokenService.getUserTokens(userId);
      this.logSecurityEvent('GET_USER_TOKENS_SUCCESS', { userId, tokenCount: tokens.length });
      
      // A lógica de mascarar o token foi mantida como estava
      return this.response.json({ tokens: tokens.map(token => ({ /* ... seu código de mapeamento ... */ })) });
    } catch (error: any) {
      this.logSecurityEvent('GET_USER_TOKENS_ERROR', { userId: this.request.user?.id, error: error.message });
      return this.next(error);
    }
  }

  // Get token info (admin only)
  public async getTokenInfo() {
    try {
      // ALTERADO: Verifica 'this.request.user'
      if (!this.request.user) {
        this.logSecurityEvent('GET_TOKEN_INFO_NOT_AUTHENTICATED');
        return this.response.status(401).json({ error: 'Authentication required' });
      }

      // ALTERADO: Verifica 'this.request.user.accessLevel'
      if (this.request.user.accessLevel !== 0) {
        this.logSecurityEvent('GET_TOKEN_INFO_INSUFFICIENT_PERMISSIONS', { userId: this.request.user.id, accessLevel: this.request.user.accessLevel });
        return this.response.status(403).json({ error: 'Admin access required' });
      }

      const { token } = this.request.params;
      if (!token) {
        this.logSecurityEvent('GET_TOKEN_INFO_MISSING_TOKEN');
        return this.response.status(400).json({ error: 'Token is required' });
      }

      this.logSecurityEvent('GET_TOKEN_INFO_ATTEMPT', { adminUserId: this.request.user.id, tokenLength: token.length });
      const tokenInfo = await CardTokenService.getTokenInfo(token);

      if (tokenInfo) {
        this.logSecurityEvent('GET_TOKEN_INFO_SUCCESS', { adminUserId: this.request.user.id, tokenUserId: tokenInfo.userId });
        return this.response.json(tokenInfo);
      }

      this.logSecurityEvent('GET_TOKEN_INFO_NOT_FOUND');
      return this.response.status(404).json({ error: 'Token not found' });
    } catch (error: any) {
      this.logSecurityEvent('GET_TOKEN_INFO_ERROR', { adminUserId: this.request.user?.id, error: error.message });
      return this.next(error);
    }
  }

  // Get rate limit info (lógica original mantida, mas ajustada para req.user)
  public async getRateLimitInfo() {
    try {
      if (!this.request.user) {
        return this.response.status(401).json({ error: 'Authentication required' });
      }

      const { id: userId } = this.request.user;
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
      // ALTERADO: Verifica 'this.request.user'
      if (!this.request.user) {
        this.logSecurityEvent('CLEANUP_TOKENS_NOT_AUTHENTICATED');
        return this.response.status(401).json({ error: 'Authentication required' });
      }

      // ALTERADO: Verifica 'this.request.user.accessLevel'
      if (this.request.user.accessLevel !== 0) {
        this.logSecurityEvent('CLEANUP_TOKENS_INSUFFICIENT_PERMISSIONS', { userId: this.request.user.id, accessLevel: this.request.user.accessLevel });
        return this.response.status(403).json({ error: 'Admin access required' });
      }

      this.logSecurityEvent('CLEANUP_TOKENS_ATTEMPT', { adminUserId: this.request.user.id });
      const deletedCount = await CardTokenService.cleanupExpiredTokens();
      this.logSecurityEvent('CLEANUP_TOKENS_SUCCESS', { adminUserId: this.request.user.id, deletedCount });

      return this.response.json({
        message: `Cleaned up ${deletedCount} expired tokens`,
        deletedCount,
      });
    } catch (error: any) {
      this.logSecurityEvent('CLEANUP_TOKENS_ERROR', { adminUserId: this.request.user?.id, error: error.message });
      return this.next(error);
    }
  }
}

export default CardTokenController;