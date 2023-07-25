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
    const result = await InvoiceModel.update({ paid: 1 }, { where: { id } });
    if (!result[0]) throw new CustomError('Not Modified', 403);
    return result;
  }

  public static async generateInvoices(
    parcels: number,
    day: number,
    method: string,
    userId: number,
    totalPrice: number,
    dependents: number,
  ) {
    const invoices = [];
    const price = totalPrice / parcels;
    const expiration = new Date();
    expiration.setDate(day);
    invoices.push({
      amount: 20 + 5 * dependents,
      paid: 0,
      method,
      userId,
      expiration: `${expiration.getFullYear()}-${
        expiration.getMonth() + 1
      }-${expiration.getDate()}`,
    });
    for (let i = 1; i <= parcels; i += 1) {
      invoices.push({
        amount: price,
        paid: 0,
        method,
        userId,
        expiration: `${expiration.getFullYear()}-${
          expiration.getMonth() + 1
        }-${expiration.getDate()}`,
      });
      expiration.setMonth(expiration.getMonth() + 1);
    }
    const result = await InvoiceModel.bulkCreate(invoices);
    return result;
  }

  public static async getTotalPaid() {
    const paidInvoices = await InvoiceModel.findAll({
      where: { paid: 1 },
    });
    const result = paidInvoices.reduce(
      (acc, invoice) => acc + invoice.amount,
      0,
    );
    return result;
  }

  public static async getTotalPending() {
    const pendingInvoices = await InvoiceModel.findAll({
      where: { paid: 0 },
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

export default InvoiceService;
