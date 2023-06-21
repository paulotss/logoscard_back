import InvoiceModel from '../database/models/invoice.model';
import UserModel from '../database/models/user.model';
import CustomError from '../utils/CustomError';

class InvoiceService {
  public static async getOne(id: number) {
    const result = await InvoiceModel.findByPk(id, {
      include: {
        model: UserModel,
        as: 'user',
      },
    });
    if (!result) throw new CustomError('Not Found', 404);
    return result;
  }

  public static async pay(id: number) {
    const result = await InvoiceModel.update({ paid: 1 }, { where: { id } });
    if (!result[0]) throw new CustomError('Not Modified', 403);
    return result;
  }
}

export default InvoiceService;
