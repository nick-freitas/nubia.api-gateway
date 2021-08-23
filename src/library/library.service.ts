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
        // brokers: ['kafka1-service:9091','kafka2-service:9092','kafka3-service:9093','kafka4-service:9094','kafka5-service:9095','kafka6-service:9096'],
        brokers: ['kafka2-service:9092'],
      },
      consumer: {
        groupId: 'library-consumer', // hero-consumer-client
      },
    },
  })
  libraryClient: ClientKafka;

  onModuleInit() {
    this.libraryClient.subscribeToResponseOf('library'); // hero.get.reply
  }

  getLibrary(): Observable<any> {
    const startTs = Date.now();
    const topic = 'library';
    const payload = {};

    return this.libraryClient
      .send<string>(topic, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }
}
