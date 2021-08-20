import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

@Injectable()
export class GamebookService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gamebook', // hero-client
        brokers: ['kafka-service:9092'],
      },
      consumer: {
        groupId: 'gamebook-consumer', // hero-consumer-client
      },
    },
  })
  gamebookClient: ClientKafka;

  onModuleInit() {
    this.gamebookClient.subscribeToResponseOf('gamebook.get-test'); // hero.get.reply
  }

  getGamebook(): Observable<any> {
    const startTs = Date.now();
    const topic = 'gamebook.get-test';
    const payload = {};

    return this.gamebookClient
      .send<string>(topic, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }
}
