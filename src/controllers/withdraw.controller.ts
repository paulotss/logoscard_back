import { Request, Response, NextFunction } from 'express';
import WithdrawService from '../services/withdraw.service';

class WithdrawController {
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
      const result = await WithdrawService.totalAmount();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getAll() {
    try {
      const result = await WithdrawService.getAll();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async create() {
    const { amount, userId } = this.request.body;
    try {
      const result = await WithdrawService.create(
        Number(amount),
        Number(userId),
      );
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default WithdrawController;
