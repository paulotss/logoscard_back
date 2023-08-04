import WithdrawModel from '../database/models/withdraw.model';

class WithdrawService {
  public static async totalAmount() {
    const withdraws = await WithdrawModel.findAll();
    const initialValue = 0;
    const result = withdraws.reduce(
      (acc, withdraw) => acc + withdraw.amount,
      initialValue,
    );
    return result;
  }

  public static async create(amount: number, userId: number) {
    const result = await WithdrawModel.create({ amount, userId });
    return result;
  }
}

export default WithdrawService;
