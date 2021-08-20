import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGateway(): string {
    return 'Standard API Gateway response from the gateway itself';
  }
}
