import { IExceptionFilter } from './exception.filter.interface';
import { NextFunction, Request, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { HttpError } from './http-error.class';

export class ExceptionFilter implements IExceptionFilter {
  logger: ILogger;
  constructor(logger: ILogger) {
    this.logger = logger;
  }
  catch(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HttpError) {
      this.logger.error(`Ошибка ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
