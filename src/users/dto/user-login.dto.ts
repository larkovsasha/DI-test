import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail({}, { message: 'Mail is incorrect' })
  email: string;

  @IsString({ message: 'Password is incorrect' })
  password: string;
}
