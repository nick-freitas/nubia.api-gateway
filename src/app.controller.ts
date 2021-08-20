import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getGateway(): string {
    return this.appService.getGateway();
  }

  @Get('auth')
  getAuth(): any {
    return this.appService.getAuth();
  }

  @Get('gamebook')
  getGamebook(): string {
    return this.appService.getGamebook();
  }

  @Get('library')
  getLibrary(): string {
    return this.appService.getLibrary();
  }
}
