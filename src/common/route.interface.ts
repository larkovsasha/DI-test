import { NextFunction, Request, Response, Router } from 'express';

export interface IControllerRoute {
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  callback: (req: Request, res: Response, next: NextFunction) => void;
  path: string;
}
