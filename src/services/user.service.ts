import PlanModel from '../database/models/plan.model';
import UserModel from '../database/models/user.model';

class UserService {
  public static async getAll() {
    const result = await UserModel.findAll();
    return result;
  }

  public static async getOne(id: number) {
    const result = await UserModel.findByPk(id, {
      include: PlanModel,
    });
    return result;
  }
}

export default UserService;
