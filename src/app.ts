import express, { Express } from 'express';
import { Server } from 'node:http';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
export class App {
  private app: Express;
  private server: Server;
  readonly port: number;
  private logger: ILogger;
  private userController: UsersController;
  private exceptionFilter: IExceptionFilter;

  constructor(
    logger: LoggerService,
    userController: UsersController,
    exceptionFilter: IExceptionFilter,
    port = 8000
  ) {
    this.app = express();
    this.port = port;
    this.logger = logger;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExceptionFilter() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
  async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server has been started on ${this.port}`);
  }
}
