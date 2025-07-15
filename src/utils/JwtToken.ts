import jwt from 'jsonwebtoken';

type UserPayloadType = {
  email: string;
  accessLevel: number;
  userId?: number;
};

class JwtToken {
  private privateKey: string;

  constructor() {
    this.privateKey = process.env.JWT_TOKEN || 'shhhh';
  }

  public generateToken(payload: UserPayloadType) {
    return jwt.sign({ payload }, this.privateKey, {
      expiresIn: '1d',
    });
  }

  public getPayload(token: string) {
    return jwt.verify(token, this.privateKey);
  }
}

export default JwtToken;
