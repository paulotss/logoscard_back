import InvoiceModel from '../../database/models/invoice.model';
import CustomError from '../../utils/CustomError';
import Invoice from '../../domains/Invoice';
import IInvoice from '../../interfaces/IInvoice';

class InvoiceFactory {
  // eslint-disable-next-line class-methods-use-this
  private createInvoiceDomain(invoice: IInvoice): Invoice {
    return new Invoice(invoice);
  }

  public async getById(invoiceId: number): Promise<Invoice> {
    const result = await InvoiceModel.findByPk(invoiceId);
    if (!result) throw new CustomError('Not Found', 404);
    const { id, amount, expiration, method, paid } = result;
    return this.createInvoiceDomain({ id, amount, expiration, method, paid });
  }

  public async update(invoice: IInvoice): Promise<Invoice> {
    const result = await InvoiceModel.update(invoice, {
      where: { id: invoice.id },
    });
    if (!result[0]) throw new CustomError('Not Modified', 304);
    return this.createInvoiceDomain(invoice);
  }
}

export default InvoiceFactory;
