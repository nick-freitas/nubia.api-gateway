import { User } from '@indigobit/nubia.common';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/signup')
  signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
  ): Promise<Partial<User>> {
    if (!email) throw new BadRequestException('Missing Email');
    if (!password) throw new BadRequestException('Missing Password');
    if (!fullName) throw new BadRequestException('Missing FullName');

    return this.service.createUser(email, password, fullName);
  }

  @Patch('/users/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body('fullName') fullName: string,
  ): Promise<Partial<User>> {
    if (!userId) throw new BadRequestException('Missing Id');
    if (!fullName) throw new BadRequestException('Missing FullName');

    return this.service.updateUser(userId, fullName);
  }
}
