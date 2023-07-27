import AdminModel from '../database/models/admin.model';
import UserModel from '../database/models/user.model';
import CustomError from '../utils/CustomError';
import JwtToken from '../utils/JwtToken';

class AdminService {
  public static async login(email: string, password: string) {
    const admin = await AdminModel.findOne({
      include: [
        {
          model: UserModel,
          as: 'user',
          where: {
            email,
            password,
          },
        },
      ],
    });
    if (!admin) throw new CustomError('Not Found', 404);
    if (admin.user.password !== password)
      throw new CustomError('Not Found', 404);
    const jwt = new JwtToken();
    return jwt.generateToken(admin.user.email);
  }
}

export default AdminService;
