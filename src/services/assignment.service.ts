import AssignmentsModel from '../database/models/assignments.model';
import CustomError from '../utils/CustomError';

class AssignmentService {
  public static async create(
    planId: number,
    userId: number,
    expiration: string,
  ) {
    const result = await AssignmentsModel.create({
      expiration,
      // expiration: `${new Date().getFullYear() + 1}-${
      //   new Date().getMonth() + 1
      // }-${new Date().getDate()}`,
      planId,
      userId,
    });
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
