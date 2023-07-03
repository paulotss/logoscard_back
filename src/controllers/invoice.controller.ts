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

  public async pay() {
    const { invoiceId } = this.request.body;
    try {
      const result = await InvoiceService.pay(Number(invoiceId));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async generateInvoices() {
    const { parcels, day, userId, totalPrice } = this.request.body;
    try {
      const result = await InvoiceService.generateInvoices(
        Number(parcels),
        Number(day),
        Number(userId),
        Number(totalPrice),
      );
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getTotalPaid() {
    try {
      const result = await InvoiceService.getTotalPaid();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getTotalPending() {
    try {
      const result = await InvoiceService.getTotalPending();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default InvoiceController;
