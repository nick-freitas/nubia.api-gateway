import {
  Gamebook,
  GetUserLibraryEvent,
  LibraryEventType,
  Topics,
} from '@indigobit/nubia.common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class LibraryService implements OnModuleInit {
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
    this.libraryClient.subscribeToResponseOf(Topics.GAMEBOOKS);
  }

  getLibrary(userId: string): Promise<Array<Gamebook>> {
    const getLibraryPayload: GetUserLibraryEvent = {
      type: LibraryEventType.GET_USER_LIBRARY,
      data: { userId },
    };

    return this.libraryClient
      .send<Array<Gamebook>, GetUserLibraryEvent>(
        Topics.GAMEBOOKS,
        getLibraryPayload,
      )
      .toPromise();
  }
}
