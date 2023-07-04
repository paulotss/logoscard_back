import { Request, Response, NextFunction } from 'express';
import { extname } from 'path';
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

  public async create(fileName: string) {
    const user: IUser = this.request.body;
    user.photo =
      fileName + extname(this.request.file?.originalname || 'sample.jpg');
    try {
      const result = await UserService.create(user);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async userLogin() {
    const { email, password } = this.request.body;
    try {
      const result = await UserService.userLogin(email, password);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default UserController;
