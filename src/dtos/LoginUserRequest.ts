import { RegisterUserRequest } from './RegisterUserRequest';

export class LoginUserRequest implements Omit<RegisterUserRequest, 'email'> {
  username: string;
  password: string;
}
