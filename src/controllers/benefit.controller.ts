import { Request, Response, NextFunction } from 'express';
import BenefitService from '../services/benefit.service';

class BenefitController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async addBenefitToAssignment() {
    const { amount, benefitId, assignmentId } = this.request.body;
    try {
      const result = await BenefitService.addBenefitToAssignment(
        Number(amount),
        Number(benefitId),
        Number(assignmentId),
      );
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default BenefitController;
