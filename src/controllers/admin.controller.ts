import { Request, Response, NextFunction } from 'express';
import AdminService from '../services/admin.service';

class AdminController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async login() {
    const { email, password } = this.request.body;
    try {
      const result = await AdminService.login(email, password);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default AdminController;
