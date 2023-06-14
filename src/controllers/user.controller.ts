import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

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
    const result = await UserService.getAll();
    this.response.status(200).json(result);
  }

  public async getOne() {
    const { id } = this.request.params;
    const result = await UserService.getOne(Number(id));
    this.response.status(200).json(result);
  }
}

export default UserController;
