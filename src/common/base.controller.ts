import { IControllerRoute } from './route.interface';
import { Router, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  private readonly _router: Router = Router();
  public constructor(private logger: ILogger) {}
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
      const middlewares = route.middlewares?.map((m) => {
        return m.execute.bind(m);
      });
      const handler = route.callback.bind(this);
      const pipeline = middlewares ? [...middlewares, handler] : handler;
      this._router[route.method](route.path, pipeline);
    });
  }
}
