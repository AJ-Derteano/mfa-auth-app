import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/schemas/user.schema';

export class RegisterUserRequest
  implements Pick<User, 'username' | 'password' | 'email'>
{
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
