import UserPlanModel from '../database/models/user_plan.model';
import CustomError from '../utils/CustomError';

class UserPlanService {
  public static async removePlan(planId: number, userId: number) {
    const result = await UserPlanModel.destroy({
      where: { plan_id: planId, user_id: userId },
    });
    if (result < 1) throw new CustomError('Not found', 404);
    return result;
  }
}

export default UserPlanService;
