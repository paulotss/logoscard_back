import { Request, Response, NextFunction } from 'express';
import JwtToken from '../utils/JwtToken';
import CustomError from '../utils/CustomError';

class AuthHandle {
  public static async authVerify(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { authorization } = req.headers;
      if (!authorization) throw new CustomError('erro', 404);
      const jwt = new JwtToken();
      res.locals.jwt = jwt.getPayload(authorization);
      return next();
    } catch (error) {
      return res.sendStatus(403);
    }
  }
}

export default AuthHandle;
