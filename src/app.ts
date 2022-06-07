import express, { Express } from 'express';
import { Server } from 'node:http';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/controller/users.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';

@injectable()
export class App {
  private app: Express;
  private server: Server;
  readonly port: number;

  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.UserController) private userController: UsersController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    port = 8000
  ) {
    this.app = express();
    this.port = port;
  }
  useMiddleware() {
    this.app.use(json());
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExceptionFilter() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
  async init() {
    this.useMiddleware();
    this.useRoutes();
    this.useExceptionFilter();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server has been started on ${this.port}`);
  }
}
