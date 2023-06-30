import AssignmentsModel from '../database/models/assignments.model';
import CustomError from '../utils/CustomError';
import UserService from './user.service';

class AssignmentService {
  public static async create(
    planId: number,
    userId: number,
    expiration: string,
  ) {
    await AssignmentsModel.create({
      expiration,
      planId,
      userId,
    });
    const result = await UserService.getOne(userId);
    return result;
  }

  public static async remove(assignmentId: number) {
    const result = await AssignmentsModel.destroy({
      where: { id: assignmentId },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }
}

export default AssignmentService;
