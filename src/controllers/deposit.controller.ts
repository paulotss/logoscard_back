import { Request, Response, NextFunction } from 'express';
import DepositService from '../services/deposit.service';

class DepositController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async totalAmount() {
    try {
      const result = await DepositService.totalAmount();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async create() {
    const { amount, invoiceId } = this.request.body;
    try {
      const result = await DepositService.create(
        Number(amount),
        Number(invoiceId),
      );
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default DepositController;
