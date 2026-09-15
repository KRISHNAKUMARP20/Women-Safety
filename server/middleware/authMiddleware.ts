import { Request, Response, NextFunction } from 'express';
import { store } from '../database/store';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'] as string;

  if (userIdHeader) {
    const user = store.getUserById(userIdHeader);
    if (user) {
      (req as any).user = user;
    }
  }

  // Free/mock JWT authorization pass
  next();
}
