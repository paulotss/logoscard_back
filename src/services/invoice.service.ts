import { Op } from 'sequelize';
import InvoiceModel from '../database/models/invoice.model';
import UserModel from '../database/models/user.model';
import CustomError from '../utils/CustomError';

class InvoiceService {
  public static async getOne(id: number) {
    const result = await InvoiceModel.findByPk(id, {
      include: {
        model: UserModel,
        as: 'user',
      },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async pay(id: number) {
    const [affectedRows] = await InvoiceModel.update({ paid: true }, { where: { id } });
    if (affectedRows === 0) throw new CustomError('Invoice not found or already paid', 404);
    return { message: 'Invoice paid successfully' };
  }

  public static async generateInvoices(
    parcels: number,
    day: number,
    method: string,
    userId: number,
    totalPrice: number,
    dependents: number,
    pagbankSubscriptionId: string,
  ) {
    const invoices = [];
    const price = totalPrice / parcels;

    for (let i = 0; i < parcels; i += 1) {
      const expiration = new Date();
      expiration.setDate(day);
      expiration.setMonth(expiration.getMonth() + i);
      expiration.setHours(23, 59, 59, 999);

      const currentAmount = i === 0 ? price + (20 + 5 * dependents) : price;

      invoices.push({
        amount: currentAmount,
        paid: false,
        method,
        userId,
        expiration,
        pagbankSubscriptionId,
      });
    }
    const result = await InvoiceModel.bulkCreate(invoices);
    return result;
  }

  public static async payByPagBankSubscriptionId(pagbankSubscriptionId: string) {
    const invoiceToPay = await InvoiceModel.findOne({
      where: {
        pagbankSubscriptionId,
        paid: false,
      },
      order: [['expiration', 'ASC']],
    });

    if (invoiceToPay) {
      console.log(`Webhook: Marking invoice ${invoiceToPay.id} as paid.`);
      await invoiceToPay.update({ paid: true });
      return invoiceToPay;
    } else {
      console.warn(`Webhook: No pending invoice found for subscription ID: ${pagbankSubscriptionId}. It might have all been paid already.`);
      return { message: 'No pending invoice to update.' };
    }
  }

  public static async getTotalPaid() {
    const paidInvoices = await InvoiceModel.findAll({
      where: { paid: true },
    });
    const result = paidInvoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );
    return result;
  }

  public static async getTotalPending() {
    const pendingInvoices = await InvoiceModel.findAll({
      where: { paid: false },
    });
    const result = pendingInvoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );
    return result;
  }

  public static async getTotalOverdue() {
    const overdueInvoices = await InvoiceModel.findAll({
      where: {
        paid: false,
        expiration: {
          [Op.lt]: new Date(),
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

export default InvoiceService;