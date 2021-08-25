import {
  CreateGamebookEvent,
  Gamebook,
  GamebookCreatedEvent,
  GamebookEventType,
  GamebookUpdatedEvent,
  Topics,
  UpdateGamebookEvent,
  User,
} from '@indigobit/nubia.common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { create } from 'domain';
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

  async createGamebook(
    title: string,
    description: string,
    imageSrc: string,
    price: number,
  ): Promise<Gamebook> {
    const id = uuid();
    const createPayload: CreateGamebookEvent = {
      type: GamebookEventType.CREATE_GAMEBOOK,
      data: {
        id,
        title,
        description,
        imageSrc,
        price,
      },
    };

    console.info(
      `Sending Event -> ${createPayload.type}`,
      JSON.stringify(createPayload),
    );
    const createdGamebook = await this.gamebookClient
      .send<Gamebook, CreateGamebookEvent>(Topics.GAMEBOOKS, createPayload)
      .toPromise();

    const createdPayload: GamebookCreatedEvent = {
      type: GamebookEventType.GAMEBOOK_CREATED,
      data: { ...createdGamebook, version: createdGamebook.version },
    };

    console.info(
      `Sending Event -> ${createdPayload.type}`,
      JSON.stringify(createdPayload),
    );
    await this.gamebookClient
      .send<Gamebook, GamebookCreatedEvent>(Topics.GAMEBOOKS, createdPayload)
      .toPromise();

    return createdGamebook;
  }

  async updateGamebook(gamebook: Gamebook): Promise<Gamebook> {
    const updatePayload: UpdateGamebookEvent = {
      type: GamebookEventType.UPDATE_GAMEBOOK,
      data: gamebook,
    };

    console.info(`Sending Event -> ${updatePayload.type}`);
    const updatedGamebook = await this.gamebookClient
      .send<Gamebook, UpdateGamebookEvent>(Topics.GAMEBOOKS, updatePayload)
      .toPromise();

    const updatedPayload: GamebookUpdatedEvent = {
      type: GamebookEventType.GAMEBOOK_UPDATED,
      data: { ...updatedGamebook, version: updatedGamebook.version },
    };

    console.info(`Sending Event -> ${updatedPayload.type}`);
    await this.gamebookClient
      .send<Gamebook, GamebookUpdatedEvent>(Topics.GAMEBOOKS, updatedPayload)
      .toPromise();

    return updatedGamebook;
  }
}
