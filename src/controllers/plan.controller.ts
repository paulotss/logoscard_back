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
    try {
      const result = await PlanService.getAll();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getById() {
    const { id } = this.request.params;
    try {
      const result = await PlanService.getById(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default PlanController;
