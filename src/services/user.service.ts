import AssignmentsModel from '../database/models/assignments.model';
import BenefitModel from '../database/models/benefit.model';
import InvoiceModel from '../database/models/invoice.model';
import PlanModel from '../database/models/plan.model';
import UserModel from '../database/models/user.model';
import IUser from '../interfaces/IUser';
import CustomError from '../utils/CustomError';
import JwtToken from '../utils/JwtToken';
import DependentService from './dependent.service';

type DependentUserType = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    cellPhone: string;
    password: string;
    photo?: string;
    rg: string;
    cpf: string;
  };
  assignmentId: number;
};

class UserService {
  public static async getAll() {
    const result = await UserModel.findAll({
      where: {
        admin: false,
      },
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
              include: [
                {
                  model: BenefitModel,
                  as: 'benefits',
                },
              ],
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

  public static async createBulkDependent(data: DependentUserType[]) {
    const users = data.map(d => d.user);
    const newUsers = await UserModel.bulkCreate(users);
    const dependents = newUsers.map((u, index) => ({
      userId: u.id,
      assignmentId: data[index].assignmentId,
    }));
    const result = await DependentService.createBulk(dependents);
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

  public static async userLogin(
    email: string,
    password: string,
    admin: boolean,
  ) {
    const user = await UserModel.findOne({
      where: { email, admin },
    });
    if (!user) throw new CustomError('Not found', 404);
    if (user.password !== password)
      throw new CustomError('Wrong password', 401);
    const jwt = new JwtToken();
    return jwt.generateToken(user.email);
  }
}

export default UserService;
