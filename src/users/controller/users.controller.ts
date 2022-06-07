import { BaseController } from '../../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserService } from '../service/user.service';
import { ILogger } from '../../logger/logger.interface';
import { ValidateMiddleware } from '../../common/middleware/validate.middleware';

@injectable()
export class UsersController
  extends BaseController
  implements IUsersController
{
  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.UserService) private UserService: UserService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'post',
        callback: this.register,
        path: '/register',
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      { method: 'post', callback: this.login, path: '/login' },
    ]);
  }

  login(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UserLoginDto
    >,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, 'login');
  }

  async register(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UserRegisterDto
    >,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, 'register');
  }
}
