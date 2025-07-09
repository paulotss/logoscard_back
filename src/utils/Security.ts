import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { SecurityConfig } from '../config/security.config';

export class SecurityUtils {
  // Encrypt sensitive data
  static encrypt(text: string, key?: string): string {
    try {
      const encryptionKey =
        key ||
        process.env.ENCRYPTION_KEY ||
        crypto.randomBytes(32).toString('hex');
      const algorithm = 'aes-256-cbc';

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(algorithm, encryptionKey);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  // Decrypt sensitive data
  static decrypt(encryptedText: string, key?: string): string {
    try {
      const encryptionKey = key || process.env.ENCRYPTION_KEY;
      if (!encryptionKey) {
        throw new Error('Encryption key not found');
      }

      const parts = encryptedText.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];

      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  // Hash passwords
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SecurityConfig.password.bcryptRounds);
  }

  // Verify password
  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate secure random string
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and > characters
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .slice(0, 1000); // Limit length
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return input;
  }

  // Validate CPF
  static validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i], 10) * (10 - i);
    }
    let remainder = sum % 11;
    let checkDigit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cpf[9], 10) !== checkDigit1) {
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i], 10) * (11 - i);
    }
    remainder = sum % 11;
    let checkDigit2 = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(cpf[10], 10) === checkDigit2;
  }

  // Validate CNPJ
  static validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, '');

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    // Validate check digits
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i], 10) * weights1[i];
    }
    let remainder = sum % 11;
    let checkDigit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cnpj[12], 10) !== checkDigit1) {
      return false;
    }

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i], 10) * weights2[i];
    }
    remainder = sum % 11;
    let checkDigit2 = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(cnpj[13], 10) === checkDigit2;
  }

  // Mask sensitive data for logging
  static maskSensitiveData(data: any): any {
    if (typeof data === 'string') {
      if (data.length <= 4) {
        return '*'.repeat(data.length);
      }
      return (
        data.substring(0, 2) +
        '*'.repeat(data.length - 4) +
        data.substring(data.length - 2)
      );
    }

    if (typeof data === 'object' && data !== null) {
      const masked: any = {};
      for (const key in data) {
        if (
          SecurityConfig.logging.sensitiveFields.includes(key.toLowerCase())
        ) {
          masked[key] = '[MASKED]';
        } else {
          masked[key] = this.maskSensitiveData(data[key]);
        }
      }
      return masked;
    }

    return data;
  }

  // Generate hash for request fingerprinting
  static generateRequestFingerprint(req: any): string {
    const fingerprint = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      acceptLanguage: req.get('Accept-Language'),
      acceptEncoding: req.get('Accept-Encoding'),
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprint))
      .digest('hex')
      .substring(0, 16);
  }

  // Check if IP is in allowed range (for IP whitelisting)
  static isIPAllowed(ip: string, allowedIPs: string[]): boolean {
    return allowedIPs.includes(ip) || allowedIPs.includes('*');
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate CSRF token
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  // Rate limiting key generator
  static generateRateLimitKey(req: any, identifier?: string): string {
    const baseKey = identifier || req.ip;
    const route = req.route?.path || req.path;
    return `${baseKey}:${route}`;
  }

  // Validate payment amount
  static validatePaymentAmount(amount: number): boolean {
    return (
      amount >= SecurityConfig.validation.amount.min &&
      amount <= SecurityConfig.validation.amount.max
    );
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    return (
      SecurityConfig.validation.email.pattern.test(email) &&
      email.length <= SecurityConfig.validation.email.maxLength
    );
  }

  // Validate password strength
  static validatePassword(password: string): boolean {
    const config = SecurityConfig.password;
    if (password.length < config.minLength) return false;
    if (config.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (config.requireLowercase && !/[a-z]/.test(password)) return false;
    if (config.requireNumbers && !/\d/.test(password)) return false;
    if (config.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return false;
    return true;
  }

  // Generate audit log entry
  static generateAuditLog(action: string, userId?: string, details?: any): any {
    return {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details: this.maskSensitiveData(details),
      id: this.generateSecureToken(16),
    };
  }
}

export default SecurityUtils;
