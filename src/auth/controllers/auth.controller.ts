import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestExpress } from '../interfaces/requesExpress';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signIn(@Req() req: RequestExpress) {
    const username = req.user.username;
    const token = await this.authServices.generateJWT(username);

    return {
      token,
    };
  }

  @Post('mfa/setup')
  async setupMfa(@Body() body: { username: string }) {
    return this.authServices.generateTotpSecret(body.username);
  }

  @Post('mfa/verify')
  async verifyMfa(@Body() body: { username: string; token: string }) {
    return this.authServices.verifyTotpCode(body.username, body.token);
  }
}
