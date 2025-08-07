// Em: src/@types/express.d.ts

// 1. Damos um nome ao tipo do seu 'user' e o exportamos.
//    Isso permite que ele seja importado e usado em outros arquivos.
export interface JwtPayload {
  id: number;
  email: string;
  accessLevel: number;
  role?: string;
}

// 2. Usamos o nome do tipo (JwtPayload) para estender a interface Request.
//    O resultado final para o 'req.user' é o mesmo, mas o código fica mais limpo.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// 3. Mantemos o 'export {}' para garantir que o arquivo seja tratado como um módulo.
//    Se o passo 1 não resolver o 'Cannot find name' em outros arquivos,
//    remover o 'export' da interface e este 'export {}' pode forçar o TS a tratar
//    a interface como verdadeiramente global. Mas a abordagem acima é a mais comum.
export {};