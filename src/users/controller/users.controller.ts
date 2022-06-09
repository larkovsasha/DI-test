import { BaseController } from '../../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UsersService } from '../service/usersService';
import { ILogger } from '../../logger/logger.interface';
import { ValidateMiddleware } from '../../common/middlewares/validate.middleware';
import { HttpError } from '../../errors/http-error.class';
import { IConfigService } from '../../config/config.service.interface';
import { sign } from 'jsonwebtoken';
import { AuthGuard } from '../../common/middlewares/auth.guard.';

@injectable()
export class UsersController
  extends BaseController
  implements IUsersController
{
  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: UsersService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        method: 'post',
        callback: this.register,
        path: '/register',
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        method: 'post',
        callback: this.login,
        path: '/login',
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        method: 'get',
        callback: this.info,
        path: '/info',
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async login(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UserLoginDto
    >,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.userService.validateUser(req.body);
    if (!result) {
      return next(new HttpError(401, 'User does not exist'));
    }
    const jwt = await this.signJWT(
      req.body.email,
      this.configService.get('SECRET')
    );
    this.ok(res, { jwt });
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
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HttpError(422, 'User already exist'));
    }
    this.ok(res, { email: result.email, id: result.id });
  }
  async info(
    {
      user,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UserRegisterDto
    >,
    res: Response,
    next: NextFunction
  ) {
    const userInfo = await this.userService.getUserInfo(user as string);
    this.ok(res, { email: userInfo?.email, id: userInfo?.id });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((res, rej) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            rej(err);
          }
          res(token as string);
        }
      );
    });
  }
}
