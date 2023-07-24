import DependentModel from '../database/models/dependent.model';

type DependentType = {
  userId: number;
  assignmentId: number;
};

class DependentService {
  public static async createBulk(data: DependentType[]) {
    const result = await DependentModel.bulkCreate(data);
    return result;
  }
}

export default DependentService;
