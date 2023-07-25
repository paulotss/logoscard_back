import UserModel from '../database/models/user.model';
import AssignmentsModel from '../database/models/assignments.model';
import CustomError from '../utils/CustomError';
import ClientModel from '../database/models/client.model';

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
              as: 'assignment',
            },
          ],
        },
      ],
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async getTotal() {
    const result = await ClientModel.count();
    return result;
  }
}

export default ClientService;
