import AssignmentsModel from '../database/models/assignments.model';
import DependentModel from '../database/models/dependent.model';
import UserModel from '../database/models/user.model';
import PlanModel from '../database/models/plan.model';
import BenefitModel from '../database/models/benefit.model';

type DependentType = {
  userId: number;
  assignmentId: number;
};

class DependentService {
  public static async createBulk(data: DependentType[]) {
    const result = await DependentModel.bulkCreate(data);
    return result;
  }

  public static async getAll() {
    const result = await DependentModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });
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
              model: BenefitModel,
              as: 'benefits',
            },
          ],
        },
      ],
    });
    return result;
  }
}

export default DependentService;
