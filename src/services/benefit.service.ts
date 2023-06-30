import AssignmentsBenefitsModel from '../database/models/assignments.benefits.model';

class BenefitService {
  public static async addBenefitToAssignment(
    amount: number,
    benefitId: number,
    assignmentId: number,
  ) {
    const result = await AssignmentsBenefitsModel.create({
      amount,
      benefitId,
      assignmentId,
    });
    return result;
  }
}

export default BenefitService;
