import { Request, Response, NextFunction } from 'express';
import DependentService from '../services/dependent.service';

class DependentController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async getOne() {
    const { id } = this.request.params;
    try {
      const result = await DependentService.getOne(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default DependentController;
