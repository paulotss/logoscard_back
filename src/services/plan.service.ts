import BenefitModel from '../database/models/benefit.model';
import PlanModel from '../database/models/plan.model';
import CustomError from '../utils/CustomError';

class PlanService {
  public static async getAll() {
    const result = await PlanModel.findAll();
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async getById(planId: number) {
    const result = await PlanModel.findByPk(planId, {
      include: {
        model: BenefitModel,
        as: 'benefits',
      },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }
}

export default PlanService;
