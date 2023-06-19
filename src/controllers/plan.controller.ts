import { Request, Response, NextFunction } from 'express';
import PlanService from '../services/plan.service';

class PlanController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async getAll() {
    const result = await PlanService.getAll();
    this.response.status(200).json(result);
  }
}

export default PlanController;
