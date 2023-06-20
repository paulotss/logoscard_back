import { Request, Response, NextFunction } from 'express';
import UserPlanService from '../services/usePlan.service';

class UserPlanController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async removePlan() {
    const { planId, userId } = this.request.body;
    try {
      const result = await UserPlanService.removePlan(
        Number(planId),
        Number(userId),
      );
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default UserPlanController;
