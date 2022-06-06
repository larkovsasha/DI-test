import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { HttpError } from '../errors/http-error.class';

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { method: 'post', callback: this.register, path: '/register' },
      { method: 'post', callback: this.login, path: '/login' },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'login');
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register');
  }
}
