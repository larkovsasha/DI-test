import express, { Express } from 'express';
import { Server } from 'node:http';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IUsersController } from './users/controller/users.controller.interface';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './data-base/prisma.service';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

@injectable()
export class App {
  readonly app: Express;
  private server: Server;
  readonly port: number;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: IUsersController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
    port = 8000
  ) {
    this.app = express();
    this.port = port;
  }
  useMiddleware() {
    this.app.use(json());
    const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
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
    await this.prismaService.connect();
    this.logger.log(`Server has been started on ${this.port}`);
  }
  close() {
    this.server.close();
  }
}
