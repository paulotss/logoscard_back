import { Request, Response, NextFunction } from 'express';
import InvoiceService from '../services/invoice.service';

class InvoiceController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  private service: InvoiceService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
    this.service = new InvoiceService();
  }

  public async getOne() {
    const { id } = this.request.params;
    try {
      const result = await this.service.getById(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async update() {
    const { invoice } = this.request.body;
    try {
      const result = await this.service.update(invoice);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async generateInvoices() {
    const { invoiceGenerate } = this.request.body;
    try {
      const result = await this.service.bulkCreate(invoiceGenerate);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getTotalPaid() {
    try {
      const result = await this.service.getTotalPaid();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getTotalPending() {
    try {
      const result = await this.service.getTotalPending();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getTotalOverdue() {
    try {
      const result = await this.service.getTotalOverdue();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default InvoiceController;
