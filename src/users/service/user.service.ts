import { IUserService } from './user.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  async createUser({ name, password, email }: UserRegisterDto): Promise<User> {
    const user = new User(name, email);
    await user.setPassword(password);
    return user;
  }
  validateUser() {
    return false;
  }
}
