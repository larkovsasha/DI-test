import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly secret: string) {}
  execute(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next();
    }
    verify(
      req.headers.authorization.split(' ')[1],
      this.secret,
      (err, payload) => {
        if (err) {
          return next();
        }
        if (payload) {
          if (typeof payload === 'string') req.user = payload;
          else req.user = payload.email;
        }
        next();
      }
    );
  }
}
