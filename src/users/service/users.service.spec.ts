import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { TYPES } from '../../types';
import { UsersService } from './usersService';
import { User } from '../entity/user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UsersRepository: IUsersRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userService: IUsersService;
let usersRepository: IUsersRepository;

beforeAll(() => {
  container.bind<IUsersService>(TYPES.UserService).to(UsersService);
  container
    .bind<IConfigService>(TYPES.ConfigService)
    .toConstantValue(ConfigServiceMock);
  container
    .bind<IUsersRepository>(TYPES.UsersRepository)
    .toConstantValue(UsersRepository);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  userService = container.get<IUsersService>(TYPES.UserService);
  usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

describe('User Service', () => {
  it('CreateUser', async () => {
    configService.get = jest.fn().mockReturnValueOnce('salt');
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      })
    );
    const createdUser = await userService.createUser({
      email: 'mail@mail.ru',
      name: 'name',
      password: 'password',
    });
    expect(createdUser?.id).toEqual(1);
    expect(createdUser?.password).not.toEqual('password');
  });

  it('validateUser - success', async () => {
    configService.get = jest.fn().mockReturnValueOnce('salt');
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      })
    );
    const createdUser = await userService.createUser({
      email: 'mail@mail.ru',
      name: 'name',
      password: 'password',
    });
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validateUser({
      email: 'mail@mail.ru',
      password: 'password',
    });
    expect(res).toBeTruthy();
  });

  it('validateUser - wrong password', async () => {
    configService.get = jest.fn().mockReturnValueOnce('salt');
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      })
    );
    const createdUser = await userService.createUser({
      email: 'mail@mail.ru',
      name: 'name',
      password: 'password',
    });
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validateUser({
      email: 'mail@mail.ru',
      password: 'WrongPassword',
    });
    expect(res).toBeFalsy();
  });
  it('validateUser - user does not exist ', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(null);
    const res = await userService.validateUser({
      email: 'mail@mail.ru',
      password: 'WrongPassword',
    });
    expect(res).toBeFalsy();
  });
});
