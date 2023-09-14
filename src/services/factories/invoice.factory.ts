import InvoiceModel from '../../database/models/invoice.model';
import CustomError from '../../utils/CustomError';
import Invoice from '../../domains/Invoice';
import IInvoice from '../../interfaces/IInvoice';

class InvoiceFactory {
  // eslint-disable-next-line class-methods-use-this
  private createInvoiceDomain(invoice: IInvoice): Invoice {
    return new Invoice(invoice);
  }

  public async getById(invoiceId: number) {
    const result = await InvoiceModel.findByPk(invoiceId);
    if (!result) throw new CustomError('Not Found', 404);
    const { id, amount, expiration, paid } = result;
    return this.createInvoiceDomain({ id, amount, expiration, paid });
  }
}

export default InvoiceFactory;
