import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { UserLoginDto } from '../dto/user-login.dto';

export interface IUserService {
  createUser: (dto: UserRegisterDto) => Promise<User | null>;
  validateUser: (dto: UserLoginDto) => boolean;
}
