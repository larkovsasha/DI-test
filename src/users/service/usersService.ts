import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
  ) {}
  async createUser({
    name,
    password,
    email,
  }: UserRegisterDto): Promise<UserModel | null> {
    const user = new User(name, email);
    const salt = this.configService.get('SALT');
    await user.setPassword(password, Number(salt));

    const existedUser = await this.usersRepository.find(email);
    if (existedUser) {
      return null;
    }
    return await this.usersRepository.create(user);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const user = await this.usersRepository.find(email);
    if (!user) return false;
    const newUser = new User(user.name, user.email, user.password);
    return await newUser.comparePassword(password);
  }

  async getUserInfo(email: string): Promise<UserModel | null> {
    return this.usersRepository.find(email);
  }
}
