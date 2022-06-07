import { IsEmail, IsString } from 'class-validator';
import 'reflect-metadata';

export class UserRegisterDto {
  @IsEmail({}, { message: 'Mail is incorrect' })
  email: string;

  @IsString({ message: 'Password is incorrect' })
  password: string;

  @IsString({ message: 'Name is incorrect' })
  name: string;
}
