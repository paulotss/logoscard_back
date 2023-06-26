import UserPlanModel from '../database/models/user_plan.model';
import CustomError from '../utils/CustomError';
import UserService from './user.service';

class UserPlanService {
  public static async addPlan(
    planId: number,
    userId: number,
    expiration: string,
  ) {
    const verifyPlan = await UserPlanModel.findOne({
      where: { plan_id: planId, user_id: userId },
    });
    if (verifyPlan) throw new CustomError('Already Exist', 409);
    await UserPlanModel.create({
      plan_id: planId,
      user_id: userId,
      expiration,
    });
    const result = await UserService.getOne(userId);
    return result;
  }

  public static async removePlan(planId: number, userId: number) {
    const result = await UserPlanModel.destroy({
      where: { plan_id: planId, user_id: userId },
    });
    if (result < 1) throw new CustomError('Not found', 404);
    return result;
  }
}

export default UserPlanService;
