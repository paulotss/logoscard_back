import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import IUser from '../interfaces/IUser';

class UserController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async getAll() {
    try {
      const result = await UserService.getAll();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getOne() {
    const { id } = this.request.params;
    try {
      const result = await UserService.getOne(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
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
    const user: IUser = this.request.body;
    try {
      const result = await UserService.create(user);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async login() {
    const { email, password } = this.request.body;
    try {
      const result = await UserService.login(email, password);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getCurrentUser() {
    const { authorization } = this.request.headers;
    try {
      if (!authorization)
        return this.response.status(404).json('Undefined Token');
      const result = await UserService.getCurrentUser(authorization);
      return this.response.status(200).json(result);
    } catch (error) {
      return this.next(error);
    }
  }

  public async update() {
    const { userId, data } = this.request.body;
    try {
      const result = await UserService.update(userId, data);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default UserController;
