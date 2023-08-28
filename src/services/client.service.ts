import UserModel from '../database/models/user.model';
import AssignmentsModel from '../database/models/assignments.model';
import InvoiceModel from '../database/models/invoice.model';
import CustomError from '../utils/CustomError';
import ClientModel from '../database/models/client.model';
import IUser from '../interfaces/IUser';
import UserService from './user.service';
import DependentModel from '../database/models/dependent.model';

class ClientService {
  public static async getAll() {
    const result = await ClientModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
          include: [
            {
              model: AssignmentsModel,
              as: 'assignments',
              include: [
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
        },
      ],
      order: [[{ model: UserModel, as: 'user' }, 'firstName', 'ASC']],
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async create(user: IUser) {
    const newUser = await UserService.create(user);
    const result = await ClientModel.create({ userId: newUser.id });
    return result;
  }

  public static async getTotal() {
    const result = await ClientModel.count();
    return result;
  }
}

export default ClientService;
