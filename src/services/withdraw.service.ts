import UserModel from '../database/models/user.model';
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

  public static async getAll() {
    const result = await WithdrawModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    return result;
  }

  public static async create(
    amount: number,
    description: string,
    userId: number,
  ) {
    const newWithdraw = await WithdrawModel.create({
      amount,
      description,
      userId,
    });
    const result = await WithdrawModel.findOne({
      where: {
        id: newWithdraw.id,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });
    return result;
  }
}

export default WithdrawService;
