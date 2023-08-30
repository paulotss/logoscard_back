import AssignmentsBenefitsModel from '../database/models/assignments.benefits.model';
import AssignmentsModel from '../database/models/assignments.model';
import BenefitModel from '../database/models/benefit.model';
import BenefitNoteModel from '../database/models/benefits.notes.model';
import DependentModel from '../database/models/dependent.model';
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
    rg: string;
    cpf: string;
  };
  assignmentId: number;
};

type UserType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  cellPhone?: string;
  password?: string;
  photo?: string;
  rg?: string;
  cpf?: string;
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
          as: 'assignments',
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
              model: AssignmentsBenefitsModel,
              as: 'assignmentBenefit',
              include: [
                {
                  model: BenefitModel,
                  as: 'benefit',
                },
                {
                  model: BenefitNoteModel,
                  as: 'notes',
                },
              ],
            },
            {
              model: DependentModel,
              as: 'dependents',
              include: [
                {
                  model: UserModel,
                  as: 'user',
                },
              ],
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
      order: [
        [{ model: AssignmentsModel, as: 'assignments' }, 'expiration', 'DESC'],
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
      rg: user.rg,
      cpf: user.cpf,
      birthday: user.birthday,
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

  public static async getCurrentUser(token: string) {
    const jwt = new JwtToken();
    const data = jwt.getPayload(token);
    const result = await UserModel.findOne({
      where: {
        email: typeof data === 'string' ? data : data.payload,
      },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async update(userId: number, data: UserType) {
    const result = await UserModel.update(
      { ...data },
      {
        where: {
          id: userId,
        },
      },
    );
    return result;
  }
}

export default UserService;
