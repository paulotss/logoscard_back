import AssignmentsBenefitsModel from '../database/models/assignments.benefits.model';
import TAssignmentBenefit from '../types/TAssignmentBenefit';

class BenefitService {
  public static async addBenefitToAssignment(payload: TAssignmentBenefit[]) {
    const result = await AssignmentsBenefitsModel.bulkCreate(payload);
    return result;
  }

  public static async updateAmountBenefitToAssignment(
    assignmentId: number,
    benefitId: number,
    amount: number,
  ) {
    const result = await AssignmentsBenefitsModel.update(
      { amount },
      {
        where: { benefitId, assignmentId },
      },
    );
    return result;
  }
}

export default BenefitService;
