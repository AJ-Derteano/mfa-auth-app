import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ErrorManager } from 'src/utils/errorManager.util';
import { UsersService } from 'src/users/users.service';
import { PayloadJWT } from 'src/dtos/PayloadJWT';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userServices.findByUsernameOrEmail(username);

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'user/not-found',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'user/invalid-password',
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async generateJWT(username: string) {
    const user = await this.userServices.findByUsernameOrEmail(username);

    const payload: PayloadJWT = {
      username: user.username,
      sub: user.username,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async generateTotpSecret(username: string) {
    const user = await this.userServices.findByUsernameOrEmail(username);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const secret = speakeasy.generateSecret({
      name: `MFA-App (${username})`,
    });

    // Guardamos el secreto en el usuario
    user.totpSecret = secret.base32;
    await user.save();

    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

    return {
      message: 'Escanea el QR en Google Authenticator',
      qrCodeDataURL,
    };
  }

  async verifyTotpCode(username: string, token: string) {
    const user = await this.userServices.findByUsernameOrEmail(username);
    if (!user || !user.totpSecret)
      throw new UnauthorizedException('Usuario no encontrado o sin MFA');

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
    });
    console.log('verified', verified);

    if (!verified) throw new UnauthorizedException('Código MFA inválido');

    return { message: 'Segundo factor verificado con éxito' };
  }
}
