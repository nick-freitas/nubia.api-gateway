import {
  CreateGamebookEvent,
  Gamebook,
  GamebookEvent,
  GamebookEventType,
  Topics,
  UserCreatedEvent,
} from '@indigobit/nubia.common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GamebookService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gamebook', // hero-client
        // brokers: ['kafka1-service:9091','kafka2-service:9092','kafka3-service:9093','kafka4-service:9094','kafka5-service:9095','kafka6-service:9096'],
        brokers: ['kafka2-service:9092'],
      },
      consumer: {
        groupId: 'gamebook-consumer', // hero-consumer-client
      },
    },
  })
  gamebookClient: ClientKafka;

  onModuleInit() {
    this.gamebookClient.subscribeToResponseOf(Topics.GAMEBOOKS);
  }

  async createGamebook(_gamebook: Gamebook): Promise<Partial<Gamebook>> {
    const { fullName } = _gamebook;
    const id = uuid();
    const createPayload: CreateGamebookEvent = {
      type: GamebookEventType.CREATE_GAMEBOOK,
      data: { id },
    };

    console.info(
      `Sending Event -> ${createPayload.type}`,
      JSON.stringify(createPayload),
    );
    const createdGamebook = await this.gamebookClient
      .send<UserCreatedEvent['data']>(Topics.GAMEBOOKS, createPayload)
      .toPromise();

    const createdPayload = {
      type: GamebookEventType.GAMEBOOK_CREATED,
      data: createdGamebook,
    };

    console.info(
      `Sending Event -> ${createdPayload.type}`,
      JSON.stringify(createdPayload),
    );
    await this.gamebookClient
      .send<Partial<Gamebook>>(Topics.GAMEBOOKS, createdPayload)
      .toPromise();

    return createdGamebook;
  }

  async updateGamebook(
    id: string,
    _gamebook: Gamebook,
  ): Promise<Partial<Gamebook>> {
    const updatePayload: GamebookEvent = {
      type: GamebookEventType.UPDATE_GAMEBOOK,
      data: _gamebook,
    };

    console.info(`Sending Event -> ${updatePayload.type}`);
    const updatedGamebook = await this.gamebookClient
      .send<Partial<Gamebook>>(Topics.GAMEBOOKS, updatePayload)
      .toPromise();

    const updatedPayload = {
      type: GamebookEventType.GAMEBOOK_UPDATED,
      data: updatedGamebook,
    };

    console.info(`Sending Event -> ${updatedPayload.type}`);
    await this.gamebookClient
      .send<Partial<Gamebook>>(Topics.GAMEBOOKS, updatedPayload)
      .toPromise();

    return updatedGamebook;
  }
}
