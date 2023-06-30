import { Request, Response, NextFunction } from 'express';
import BenefitService from '../services/benefit.service';
import TAssignmentBenefit from '../types/TAssignmentBenefit';

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
    const payload: TAssignmentBenefit[] = this.request.body;
    try {
      const result = await BenefitService.addBenefitToAssignment(payload);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async updateAmountBenefitToAssignment() {
    const { benefitId, amount, assignmentId } = this.request.body;
    try {
      const result = await BenefitService.updateAmountBenefitToAssignment(
        Number(assignmentId),
        Number(benefitId),
        Number(amount),
      );
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default BenefitController;
