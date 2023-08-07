import DepositModel from '../database/models/deposit.model';
import InvoiceModel from '../database/models/invoice.model';

class DepositService {
  public static async totalAmount() {
    const deposits = await DepositModel.findAll();
    const initialValue = 0;
    const result = deposits.reduce(
      (acc, deposit) => acc + deposit.amount,
      initialValue,
    );
    return result;
  }

  public static async getAll() {
    const result = await DepositModel.findAll({
      include: [
        {
          model: InvoiceModel,
          as: 'invoice',
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    return result;
  }

  public static async create(amount: number, invoiceId: number) {
    const result = await DepositModel.create({
      amount,
      invoiceId,
    });
    return result;
  }
}

export default DepositService;
