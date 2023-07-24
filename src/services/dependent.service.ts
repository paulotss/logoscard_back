import DependentModel from '../database/models/dependent.model';

class DependentService {
  public static async create(userId: number, assignmentId: number) {
    const result = await DependentModel.create({
      userId,
      assignmentId,
    });
    return result;
  }
}

export default DependentService;
