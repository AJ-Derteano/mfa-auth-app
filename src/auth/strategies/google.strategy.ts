import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import envConfig from 'src/config/env.config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(envConfig.KEY) configService: ConfigType<typeof envConfig>,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.GOOGLE_CLIENT_ID,
      clientSecret: configService.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/v1/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const googleUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    // Guarda o busca usuario en Mongo
    const user = await this.userService.findOrCreateGoogle(googleUser);

    // Crea JWT
    const token = await this.authService.generateJWT(user.email);

    // Devuelve payload enriquecido
    done(null, {
      user,
      access_token: token,
    });
  }
}
