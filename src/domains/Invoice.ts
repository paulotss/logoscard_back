import IInvoice from '../interfaces/IInvoice';

class Invoice {
  private id: number;

  private amount: number;

  private expiration: string;

  private paid: boolean;

  constructor(invoice: IInvoice) {
    this.id = invoice.id;
    this.amount = invoice.amount;
    this.expiration = invoice.expiration;
    this.paid = invoice.paid;
  }

  public getId(): number {
    return this.id;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getExpiration(): string {
    return this.expiration;
  }

  public getPaid(): boolean {
    return this.paid;
  }
}

export default Invoice;
