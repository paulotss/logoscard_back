import { Request, Response, NextFunction } from 'express';
import BenefitNoteService from '../services/benefit.note.service';

class BenefitNoteController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async create() {
    const { assignmentBenefitId, description } = this.request.body;
    try {
      const result = await BenefitNoteService.create(
        Number(assignmentBenefitId),
        description,
      );
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default BenefitNoteController;
