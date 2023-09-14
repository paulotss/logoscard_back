import IInvoice from '../interfaces/IInvoice';

class Invoice {
  private id: number | undefined;

  private amount: number;

  private expiration: string;

  private method: string;

  private paid: boolean;

  constructor(invoice: IInvoice) {
    this.id = invoice.id;
    this.amount = invoice.amount;
    this.expiration = invoice.expiration;
    this.method = invoice.method;
    this.paid = invoice.paid;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getExpiration(): string {
    return this.expiration;
  }

  public getMethod(): string {
    return this.method;
  }

  public getPaid(): boolean {
    return this.paid;
  }
}

export default Invoice;
