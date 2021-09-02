import { User } from '@indigobit/nubia.common';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Auth } from '../../decorators/auth.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    if (!email) throw new BadRequestException('Missing Email');
    if (!password) throw new BadRequestException('Missing Password');

    const { access_token } = await this.service.signIn(email, password);

    (response as any)?.cookie('access_token', access_token);
    return { access_token };
  }

  @Post('register')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    if (!email) throw new BadRequestException('Missing Email');
    if (!password) throw new BadRequestException('Missing Password');
    if (!fullName) throw new BadRequestException('Missing FullName');

    const { access_token } = await this.service.createUser(
      email,
      password,
      fullName,
    );

    (response as any)?.cookie('access_token', access_token);
    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/:userId')
  updateUser(
    @Auth() auth,
    @Param('userId')
    userId: string,
    @Body('fullName') fullName: string,
  ): Promise<User> {
    if (!userId) throw new BadRequestException('Missing Id');
    if (!fullName) throw new BadRequestException('Missing FullName');

    return this.service.updateUser(auth, userId, fullName);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(
    @Auth() auth,
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    await this.service.signOut(auth);
    return (response as any)?.clearCookie('access_token');
  }
}
