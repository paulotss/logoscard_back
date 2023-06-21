import { Request, Response, NextFunction } from 'express';
import InvoiceService from '../services/invoice.service';

class InvoiceController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async getOne() {
    const { id } = this.request.params;
    try {
      const result = await InvoiceService.getOne(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default InvoiceController;
