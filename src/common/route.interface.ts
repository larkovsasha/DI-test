import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware/middleware.interface';

export interface IControllerRoute {
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  callback: (req: Request, res: Response, next: NextFunction) => void;
  path: string;
  middlewares?: IMiddleware[];
}
