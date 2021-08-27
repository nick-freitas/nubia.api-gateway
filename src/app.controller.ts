import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  getGateway(): string {
    return 'Standard API Gateway response from the gateway itself';
  }
}
