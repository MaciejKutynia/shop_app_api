export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
    }
  }
}

export interface GraphQLContext {
  req: Request & {
    user: {
      id: number;
    };
  };
}
