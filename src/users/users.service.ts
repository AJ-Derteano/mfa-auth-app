import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as randomString from 'randomstring';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    user: Pick<User, 'username' | 'password' | 'email'>,
  ): Promise<User> {
    const newUser = new this.userModel(user);

    const secretKey = randomString.generate({
      length: 32,
      charset: 'alphanumeric',
    });

    newUser.secretKey = secretKey;

    return newUser.save();
  }

  async findByUsernameOrEmail(username: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [{ username }, { email: username }],
      })
      .exec();
  }

  async findOrCreateGoogle(profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }): Promise<User> {
    const { email, firstName, lastName, picture } = profile;

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        firstName,
        lastName,
        picture,
        provider: 'google',
      });

      await user.save();
    }

    return user;
  }
}
