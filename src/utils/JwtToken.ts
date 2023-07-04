import jwt from 'jsonwebtoken';

class JwtToken {
  private privateKey: string;

  constructor() {
    this.privateKey = process.env.JWT_TOKEN || 'shhhh';
  }

  public generateToken(payload: string) {
    return jwt.sign({ payload }, this.privateKey, {
      expiresIn: '1d',
    });
  }

  public getPayload(token: string) {
    return jwt.verify(token, this.privateKey);
  }
}

export default JwtToken;
