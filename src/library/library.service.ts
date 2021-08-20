import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

@Injectable()
export class LibraryService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'library', // hero-client
        brokers: ['kafka-service:9092'],
      },
      consumer: {
        groupId: 'library-consumer', // hero-consumer-client
      },
    },
  })
  libraryClient: ClientKafka;

  onModuleInit() {
    this.libraryClient.subscribeToResponseOf('library.get-test'); // hero.get.reply
  }

  getLibrary(): Observable<any> {
    const startTs = Date.now();
    const topic = 'library.get-test';
    const payload = {};

    return this.libraryClient
      .send<string>(topic, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }
}
