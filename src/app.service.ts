import { Inject, Injectable } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  ClientProxy,
  Transport,
} from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

@Injectable()
export class AppService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth', // hero-client
        brokers: ['kafka-service:9092'],
      },
      consumer: {
        groupId: 'auth-consumer', // hero-consumer-client
      },
    },
  })
  authClient: ClientKafka;

  onModuleInit() {
    this.authClient.subscribeToResponseOf('auth.get-test'); // hero.get.reply
  }

  getGateway(): string {
    return 'gateway';
  }

  getAuth(): Observable<any> {
    const startTs = Date.now();
    const topic = 'auth.get-test';
    const payload = {};

    return this.authClient
      .send<string>(topic, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }

  getGamebook(): string {
    return 'gamebook';
  }

  getLibrary(): string {
    return 'library';
  }
}
