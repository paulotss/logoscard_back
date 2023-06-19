import PhoneModel from '../database/models/phone.model';
import PlanModel from '../database/models/plan.model';
import UserModel from '../database/models/user.model';

class UserService {
  public static async getAll() {
    const result = await UserModel.findAll({
      include: {
        model: PlanModel,
        as: 'plans',
      },
    });
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
      ],
    });
    return result;
  }
}

export default UserService;
