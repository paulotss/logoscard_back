import PlanModel from '../database/models/plan.model';
import CustomError from '../utils/CustomError';

class PlanService {
  public static async getAll() {
    const result = await PlanModel.findAll();
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }
}

export default PlanService;
