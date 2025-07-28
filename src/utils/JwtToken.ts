import jwt from 'jsonwebtoken';

// Esta interface pode ficar aqui ou em um arquivo central de tipos
type UserPayloadType = {
  email: string;
  accessLevel: number;
  userId?: number;
};

class JwtToken {
  // 1. A chave privada não é mais necessária como propriedade da classe.
  // private privateKey: string;

  // 2. O construtor não é mais necessário para definir a chave.
  // constructor() { ... }

  public generateToken(payload: UserPayloadType): string {
    // 3. Lê a chave secreta oficial diretamente do .env.
    const secret = process.env.JWT_SECRET;

    // 4. Garante que a chave secreta foi definida.
    if (!secret) {
      throw new Error('Chave secreta JWT (JWT_SECRET) não configurada no .env');
    }

    // 5. Usa a chave secreta correta para assinar o token.
    return jwt.sign(
      payload, // Assina o payload diretamente, não um objeto { payload }
      secret,
      {
        expiresIn: '1d',
        algorithm: 'HS256',
      }
    );
  }

  // A função getPayload não é mais necessária, pois o middleware já faz a verificação.
  // Você pode remover este método se ele não for usado em nenhum outro lugar.
  /*
  public getPayload(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave secreta JWT (JWT_SECRET) não configurada no .env');
    }
    return jwt.verify(token, secret);
  }
  */
}

export default JwtToken;