import DependentModel from '../database/models/dependent.model';
import UserModel from '../database/models/user.model';

type DependentType = {
  userId: number;
  assignmentId: number;
};

class DependentService {
  public static async createBulk(data: DependentType[]) {
    const result = await DependentModel.bulkCreate(data);
    return result;
  }

  public static async getOne(dependentId: number) {
    const result = await DependentModel.findOne({
      where: {
        id: dependentId,
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

export default DependentService;
