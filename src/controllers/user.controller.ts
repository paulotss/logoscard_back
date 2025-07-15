import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import IUser from '../interfaces/IUser';
import { SecurityUtils } from '../utils/Security';

class UserController {
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
    const sanitizedDetails = { ...details };
    // Remove sensitive fields
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;

    console.log(`[USER_SECURITY] ${event}`, {
      timestamp: new Date().toISOString(),
      ip: this.request.ip,
      userAgent: this.request.get('User-Agent'),
      ...sanitizedDetails,
    });
  }

  public async getAll() {
    try {
      this.logSecurityEvent('GET_ALL_USERS_ATTEMPT');
      const result = await UserService.getAll();
      this.logSecurityEvent('GET_ALL_USERS_SUCCESS', { count: result.length });
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('GET_ALL_USERS_ERROR', {
        error: (error as Error).message,
      });
      return this.next(error);
    }
  }

  public async getOne() {
    try {
      const { id } = this.request.params;

      if (!id || Number.isNaN(Number(id))) {
        this.logSecurityEvent('GET_USER_INVALID_ID', { id });
        return this.response
          .status(400)
          .json({ message: 'Valid user ID is required' });
      }

      this.logSecurityEvent('GET_USER_ATTEMPT', { userId: id });
      const result = await UserService.getOne(Number(id));
      this.logSecurityEvent('GET_USER_SUCCESS', { userId: id });
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('GET_USER_ERROR', {
        error: (error as Error).message,
      });
      return this.next(error);
    }
  }

  public async createBulkDependent() {
    const data = this.request.body;
    try {
      const result = await UserService.createBulkDependent(data);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async create() {
    try {
      const user: IUser = this.request.body;

      // Input validation
      if (!user.email || !user.password || !user.firstName || !user.lastName) {
        this.logSecurityEvent('CREATE_USER_MISSING_FIELDS');
        return this.response.status(400).json({
          message: 'Email, password, first name, and last name are required',
        });
      }

      // Email validation
      if (!SecurityUtils.validateEmail(user.email)) {
        this.logSecurityEvent('CREATE_USER_INVALID_EMAIL', {
          email: user.email,
        });
        return this.response
          .status(400)
          .json({ message: 'Invalid email format' });
      }

      // Password validation
      if (!SecurityUtils.validatePassword(user.password)) {
        this.logSecurityEvent('CREATE_USER_WEAK_PASSWORD');
        return this.response.status(400).json({
          message:
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
        });
      }

      // CPF validation
      if (user.cpf && !SecurityUtils.validateCPF(user.cpf)) {
        this.logSecurityEvent('CREATE_USER_INVALID_CPF', {
          cpf: SecurityUtils.maskSensitiveData(user.cpf),
        });
        return this.response
          .status(400)
          .json({ message: 'Invalid CPF format' });
      }

      this.logSecurityEvent('CREATE_USER_ATTEMPT', { email: user.email });
      const result = await UserService.create(user);
      this.logSecurityEvent('CREATE_USER_SUCCESS', {
        userId: result.id,
        email: user.email,
      });
      this.response.status(201).json(result);
    } catch (error) {
      this.logSecurityEvent('CREATE_USER_ERROR', { error: error.message });
      this.next(error);
    }
  }

  public async login() {
    try {
      const { email, password } = this.request.body;

      // Input validation
      if (!email || !password) {
        this.logSecurityEvent('LOGIN_MISSING_CREDENTIALS');
        return this.response.status(400).json({
          message: 'Email and password are required',
        });
      }

      // Email format validation
      if (!SecurityUtils.validateEmail(email)) {
        this.logSecurityEvent('LOGIN_INVALID_EMAIL', { email });
        return this.response
          .status(400)
          .json({ message: 'Invalid email format' });
      }

      this.logSecurityEvent('LOGIN_ATTEMPT', { email });
      const result = await UserService.login(email, password);

      this.logSecurityEvent('LOGIN_SUCCESS', { email });
      this.response.status(200).json({
        token: result,
        message: 'Login successful',
      });
    } catch (error) {
      this.logSecurityEvent('LOGIN_FAILED', {
        email: this.request.body.email,
        error: error.message,
      });

      // Don't expose the exact error for security
      if (error.message.includes('Invalid credentials')) {
        return this.response.status(401).json({
          message: 'Invalid email or password',
        });
      }

      this.next(error);
    }
  }

  public async getCurrentUser() {
    try {
      const { authorization } = this.request.headers;

      if (!authorization) {
        this.logSecurityEvent('GET_CURRENT_USER_NO_TOKEN');
        return this.response
          .status(401)
          .json({ message: 'Authorization token required' });
      }

      this.logSecurityEvent('GET_CURRENT_USER_ATTEMPT');
      const result = await UserService.getCurrentUser(authorization);
      this.logSecurityEvent('GET_CURRENT_USER_SUCCESS', { userId: result.id });
      return this.response.status(200).json(result?.dataValues);
    } catch (error) {
      this.logSecurityEvent('GET_CURRENT_USER_ERROR', { error: error.message });
      return this.next(error);
    }
  }

  public async update() {
    try {
      const { id } = this.request.params;
      const updateData = this.request.body;

      if (!id || isNaN(Number(id))) {
        this.logSecurityEvent('UPDATE_USER_INVALID_ID', { id });
        return this.response
          .status(400)
          .json({ message: 'Valid user ID is required' });
      }

      // Email validation if being updated
      if (updateData.email && !SecurityUtils.validateEmail(updateData.email)) {
        this.logSecurityEvent('UPDATE_USER_INVALID_EMAIL', { userId: id });
        return this.response
          .status(400)
          .json({ message: 'Invalid email format' });
      }

      // Password validation if being updated
      if (
        updateData.password &&
        !SecurityUtils.validatePassword(updateData.password)
      ) {
        this.logSecurityEvent('UPDATE_USER_WEAK_PASSWORD', { userId: id });
        return this.response.status(400).json({
          message:
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
        });
      }

      this.logSecurityEvent('UPDATE_USER_ATTEMPT', { userId: id });
      const result = await UserService.update(Number(id), updateData);
      this.logSecurityEvent('UPDATE_USER_SUCCESS', { userId: id });
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('UPDATE_USER_ERROR', { error: error.message });
      this.next(error);
    }
  }
}

export default UserController;
