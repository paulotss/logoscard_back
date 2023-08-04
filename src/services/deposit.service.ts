import DepositModel from '../database/models/deposit.model';

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

  public static async create(amount: number, invoiceId: number) {
    const result = await DepositModel.create({
      amount,
      invoiceId,
    });
    return result;
  }
}

export default DepositService;
