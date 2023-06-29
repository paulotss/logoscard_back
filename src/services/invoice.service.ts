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
    userId: number,
    totalPrice: number,
  ) {
    const invoices = [];
    const price = totalPrice / parcels;
    const expiration = new Date();
    expiration.setDate(day);
    for (let i = 1; i <= parcels; i += 1) {
      invoices.push({
        amount: price,
        paid: 0,
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
}

export default InvoiceService;
