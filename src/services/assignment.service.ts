import AssignmentsModel from '../database/models/assignments.model';
import CustomError from '../utils/CustomError';

class AssignmentService {
  public static async remove(assignmentId: number) {
    const result = await AssignmentsModel.destroy({
      where: { id: assignmentId },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }
}

export default AssignmentService;
