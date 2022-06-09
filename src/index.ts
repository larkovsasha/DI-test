import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/controller/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUsersController } from './users/controller/users.controller.interface';
import { IUsersService } from './users/service/users.service.interface';
import { UsersService } from './users/service/usersService';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './data-base/prisma.service';
import { IUsersRepository } from './users/repository/users.repository.interface';
import { UsersRepository } from './users/repository/users.repository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IUsersController>(TYPES.UserController).to(UsersController);
  bind<IUsersService>(TYPES.UserService).to(UsersService).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

  bind<IUsersRepository>(TYPES.UsersRepository)
    .to(UsersRepository)
    .inSingletonScope();

  bind<IConfigService>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();

  bind<App>(TYPES.Application).to(App);
});

const bootstrap = async () => {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
  return { appContainer, app };
};

export const boot = bootstrap();
