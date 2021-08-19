import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGateway(): string {
    return 'gateway';
  }

  getAuth(): string {
    return 'auth';
  }

  getGamebook(): string {
    return 'gamebook';
  }

  getLibrary(): string {
    return 'library';
  }
}
