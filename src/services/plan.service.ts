import PlanModel from '../database/models/plan.model';

class PlanService {
  public static async getAll() {
    const result = await PlanModel.findAll();
    return result;
  }
}

export default PlanService;
