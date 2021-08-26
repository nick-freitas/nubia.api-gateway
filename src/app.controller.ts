import { Controller, Get } from '@nestjs/common';

@Controller('/api')
export class AppController {
  @Get('/')
  getGateway(): string {
    return 'Standard API Gateway response from the gateway itself';
  }
}
