import { Op } from 'sequelize';
import CardTokenModel from '../database/models/card.token.model';
import UserModel from '../database/models/user.model';
import CustomError from '../utils/CustomError';
import { SecurityUtils } from '../utils/Security';

class CardTokenService {
  // Rate limiting storage (in production, use Redis)
  private static rateLimitStore: Map<
    string,
    { count: number; resetTime: number }
  > = new Map();

  // Check rate limit for token generation
  private static checkRateLimit(
    userId: number,
    maxAttempts = 10,
    windowMinutes = 5,
  ): boolean {
    const key = `token_generation_${userId}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000 * 60;

    const existing = this.rateLimitStore.get(key);

    // Clean up expired entries
    if (existing && now > existing.resetTime) {
      this.rateLimitStore.delete(key);
    }

    const current = this.rateLimitStore.get(key);

    if (!current) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= maxAttempts) {
      return false;
    }

    current.count += 1;
    this.rateLimitStore.set(key, current);
    return true;
  }

  // Clean up expired tokens (should be run as cron job)
  public static async cleanupExpiredTokens(): Promise<number> {
    const deletedCount = await CardTokenModel.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });

    return deletedCount;
  }

  // Invalidate all existing tokens for a user
  private static async invalidateExistingTokens(userId: number): Promise<void> {
    await CardTokenModel.update(
      {
        isUsed: true,
        usedAt: new Date(),
      },
      {
        where: {
          userId,
          isUsed: false,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
      },
    );
  }

  // Generate a new token for a user
  public static async generateToken(
    requestingUserId: number,
    targetUserId: number,
    requestingUserAccessLevel: number,
  ): Promise<{
    token: string;
    expiresAt: Date;
    message: string;
  }> {
    // Rate limit check
    if (!this.checkRateLimit(requestingUserId)) {
      throw new CustomError(
        'Rate limit exceeded. Please try again later.',
        429,
      );
    }

    // Authorization check - users can only generate tokens for themselves, unless they're admin (accessLevel 0)
    if (requestingUserId !== targetUserId && requestingUserAccessLevel !== 0) {
      throw new CustomError('Insufficient permissions', 403);
    }

    // Validate target user exists
    const targetUser = await UserModel.findByPk(targetUserId);
    if (!targetUser) {
      throw new CustomError('User not found', 404);
    }

    // Invalidate existing tokens
    await this.invalidateExistingTokens(targetUserId);

    // Generate secure token
    const token = SecurityUtils.generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in database
    await CardTokenModel.create({
      token,
      userId: targetUserId,
      createdBy: requestingUserId,
      expiresAt,
      isUsed: false,
    });

    return {
      token,
      expiresAt,
      message: 'Token generated successfully',
    };
  }

  // Validate a token
  public static async validateToken(token: string): Promise<{
    isValid: boolean;
    tokenData?: CardTokenModel;
    user?: UserModel;
  }> {
    if (!token || token.length !== 64) {
      return { isValid: false };
    }

    const tokenData = await CardTokenModel.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
    });

    if (!tokenData) {
      return { isValid: false };
    }

    return {
      isValid: true,
      tokenData,
      user: tokenData.user,
    };
  }

  // Mark token as used
  public static async useToken(token: string): Promise<boolean> {
    const validation = await this.validateToken(token);

    if (!validation.isValid || !validation.tokenData) {
      return false;
    }

    await CardTokenModel.update(
      {
        isUsed: true,
        usedAt: new Date(),
      },
      {
        where: { id: validation.tokenData.id },
      },
    );

    return true;
  }

  // Get token info (for admin purposes)
  public static async getTokenInfo(
    token: string,
  ): Promise<CardTokenModel | null> {
    return CardTokenModel.findOne({
      where: { token },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        {
          model: UserModel,
          as: 'creator',
          attributes: { exclude: ['password'] },
        },
      ],
    });
  }

  // Get user's active tokens
  public static async getUserTokens(userId: number): Promise<CardTokenModel[]> {
    return CardTokenModel.findAll({
      where: {
        userId,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: UserModel,
          as: 'creator',
          attributes: { exclude: ['password'] },
        },
      ],
    });
  }

  // Get rate limit info for user
  public static getRateLimitInfo(userId: number): {
    remaining: number;
    resetTime: Date | null;
  } {
    const key = `token_generation_${userId}`;
    const existing = this.rateLimitStore.get(key);

    if (!existing || Date.now() > existing.resetTime) {
      return { remaining: 5, resetTime: null };
    }

    return {
      remaining: Math.max(0, 5 - existing.count),
      resetTime: new Date(existing.resetTime),
    };
  }
}

export default CardTokenService;
