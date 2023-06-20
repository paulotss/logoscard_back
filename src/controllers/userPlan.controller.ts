import { Request, Response, NextFunction } from 'express';
import UserPlanService from '../services/usePlan.service';
import UserService from '../services/user.service';

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
      await UserPlanService.removePlan(Number(planId), Number(userId));
      const result = await UserService.getOne(userId);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default UserPlanController;
