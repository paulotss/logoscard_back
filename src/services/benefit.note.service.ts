import BenefitNoteModel from '../database/models/benefits.notes.model';

class BenefitNoteService {
  public static async create(assignmentBenefitId: number, description: string) {
    const result = await BenefitNoteModel.create({
      assignmentBenefitId,
      description,
    });
    return result;
  }
}

export default BenefitNoteService;
