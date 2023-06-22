import InvoiceModel from '../database/models/invoice.model';
import PhoneModel from '../database/models/phone.model';
import PlanModel from '../database/models/plan.model';
import UserModel from '../database/models/user.model';
import IUser from '../interfaces/IUser';
import CustomError from '../utils/CustomError';

class UserService {
  public static async getAll() {
    const result = await UserModel.findAll({
      include: {
        model: PlanModel,
        as: 'plans',
      },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async getOne(id: number) {
    const result = await UserModel.findByPk(id, {
      include: [
        {
          model: PhoneModel,
          as: 'phone',
        },
        {
          model: PlanModel,
          as: 'plans',
        },
        {
          model: InvoiceModel,
          as: 'invoices',
          separate: true,
          order: [['expiration', 'DESC']],
        },
      ],
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async create(user: IUser) {
    const result = await UserModel.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      photo: user.photo,
      rg: user.rg,
      cpf: user.cpf,
      admin: 0,
    });
    return result;
  }
}

export default UserService;
