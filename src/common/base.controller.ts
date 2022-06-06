import { IControllerRoute } from './route.interface';
import { Router, Response } from 'express';
import { ILogger } from '../logger/logger.interface';

export abstract class BaseController {
  private readonly _router: Router = Router();
  protected constructor(protected logger: ILogger) {}
  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);
      const handler = route.callback.bind(this);
      this._router[route.method](route.path, handler);
    });
  }
}
