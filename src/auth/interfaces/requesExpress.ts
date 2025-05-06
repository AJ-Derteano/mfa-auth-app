import { Request } from 'express';

export interface RequestExpress extends Request {
  user: {
    username: string;
    role: string;
    sub: string;
    nickname: string;
    iat: number;
    exp: number;
  };
}
