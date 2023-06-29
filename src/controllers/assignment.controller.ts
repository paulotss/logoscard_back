import { Request, Response, NextFunction } from 'express';
import AssignmentService from '../services/assignment.service';

class AssignmentController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async create() {
    const { expiration, planId, userId } = this.request.body;
    try {
      const result = await AssignmentService.create(
        Number(planId),
        Number(userId),
        expiration,
      );
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async remove() {
    const { id } = this.request.params;
    try {
      const result = await AssignmentService.remove(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default AssignmentController;
