declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        accessLevel: number;
        role?: string;
      };
    }
  }
}

export {};
