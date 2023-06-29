import AssignmentsModel from '../database/models/assignments.model';
import BenefitModel from '../database/models/benefit.model';
import InvoiceModel from '../database/models/invoice.model';
import PlanModel from '../database/models/plan.model';
import UserModel from '../database/models/user.model';
import IUser from '../interfaces/IUser';
import CustomError from '../utils/CustomError';

class UserService {
  public static async getAll() {
    const result = await UserModel.findAll({
      include: {
        model: AssignmentsModel,
        as: 'assignment',
      },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async getOne(id: number) {
    const result = await UserModel.findByPk(id, {
      include: [
        {
          model: AssignmentsModel,
          as: 'assignment',
          include: [
            {
              model: PlanModel,
              as: 'plan',
            },
            {
              model: BenefitModel,
              as: 'benefits',
            },
          ],
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
      cellPhone: user.cellPhone,
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
