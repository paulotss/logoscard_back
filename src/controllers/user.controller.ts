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

  public async userLogin() {
    const { email, password, admin } = this.request.body;
    try {
      const result = await UserService.userLogin(email, password, admin);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getCurrentUser() {
    const { token } = this.request.params;
    try {
      const result = await UserService.getCurrentUser(token);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
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
