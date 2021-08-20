import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthService {
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
}
