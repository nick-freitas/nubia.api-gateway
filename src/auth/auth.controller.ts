import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Get('/')
  getAuth(): Observable<any> {
    return this.service.getAuth();
  }
}
