/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import InvoiceModel from '../database/models/invoice.model';
import CustomError from '../utils/CustomError';
import Invoice from '../domains/Invoice';
import IInvoice from '../interfaces/IInvoice';
import TInvoiceGenerate from '../types/TInvoiceGenerate';

class InvoiceSercice {
  private createInvoiceDomain(invoice: IInvoice): Invoice {
    return new Invoice(invoice);
  }

  public async getById(invoiceId: number): Promise<Invoice> {
    const result = await InvoiceModel.findByPk(invoiceId);
    if (!result) throw new CustomError('Not Found', 404);
    return this.createInvoiceDomain(result);
  }

  public async update(invoice: IInvoice): Promise<Invoice> {
    const result = await InvoiceModel.update(invoice, {
      where: { id: invoice.id },
    });
    if (!result[0]) throw new CustomError('Not Modified', 304);
    return this.createInvoiceDomain(invoice);
  }

  public async bulkCreate(data: TInvoiceGenerate) {
    const price = data.totalPrice / data.parcels;
    const expiration = new Date();
    expiration.setDate(data.day);
    const invoices: Array<Invoice> = [];
    invoices.push(
      this.createInvoiceDomain({
        amount: 20 + 5 * data.dependents,
        paid: false,
        method: data.method,
        userId: data.userId,
        expiration: `${expiration.getFullYear()}-${
          expiration.getMonth() + 1
        }-${expiration.getDate()}`,
      }),
    );
    for (let i = 1; i <= data.parcels; i += 1) {
      invoices.push(
        this.createInvoiceDomain({
          amount: price,
          paid: false,
          method: data.method,
          userId: data.userId,
          expiration: `${expiration.getFullYear()}-${
            expiration.getMonth() + 1
          }-${expiration.getDate()}`,
        }),
      );
      expiration.setMonth(expiration.getMonth() + 1);
    }
  }

  public async getTotalPaid() {
    const paidInvoices = await InvoiceModel.findAll({
      where: { paid: 1 },
    });
    const result = paidInvoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );
    return result;
  }

  public async getTotalPending() {
    const pendingInvoices = await InvoiceModel.findAll({
      where: { paid: 0 },
    });
    const result = pendingInvoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );
    return result;
  }

  public async getTotalOverdue() {
    const overdueInvoices = await InvoiceModel.findAll({
      where: {
        paid: 0,
        expiration: {
          [Op.lt]: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}`,
        },
      },
    });
    const result = overdueInvoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );
    return result;
  }
}

export default InvoiceSercice;
