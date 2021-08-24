import { v4 as uuidv4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import {
  Topics,
  User,
  UserEvent,
  UserEventType,
} from '@indigobit/nubia.common';

@Injectable()
export class AuthService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth',
        // brokers: ['kafka1-service:9091','kafka2-service:9092','kafka3-service:9093','kafka4-service:9094','kafka5-service:9095','kafka6-service:9096'],
        brokers: ['kafka2-service:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  })
  authClient: ClientKafka;

  onModuleInit() {
    this.authClient.subscribeToResponseOf(Topics.USERS);
  }

  async createUser(
    email: string,
    password: string,
    fullName: string,
  ): Promise<Partial<User>> {
    const createPayload: UserEvent = {
      type: UserEventType.CREATE_USER,
      data: {
        email,
        password,
        fullName,
        id: uuidv4(),
        version: 1,
      },
    };

    console.info(
      `Sending Event -> ${createPayload.type}`,
      JSON.stringify(createPayload),
    );
    const user = await this.authClient
      .send<Partial<User>>(Topics.USERS, createPayload)
      .toPromise();

    const createdPayload = {
      type: UserEventType.USER_CREATED,
      data: user,
    };

    console.info(
      `Sending Event -> ${createdPayload.type}`,
      JSON.stringify(createdPayload),
    );
    await this.authClient
      .send<Partial<User>>(Topics.USERS, createdPayload)
      .toPromise();

    return user;
  }

  async updateUser(id: string, fullName: string): Promise<Partial<User>> {
    const updatePayload: UserEvent = {
      type: UserEventType.UPDATE_USER,
      data: {
        id,
        fullName,
        version: 0,
      },
    };

    console.info(`Sending Event -> ${updatePayload.type}`);
    const user = await this.authClient
      .send<Partial<User>>(Topics.USERS, updatePayload)
      .toPromise();

    const updatedPayload = {
      type: UserEventType.USER_UPDATED,
      data: user,
    };

    console.info(`Sending Event -> ${updatedPayload.type}`);
    await this.authClient
      .send<Partial<User>>(Topics.USERS, updatedPayload)
      .toPromise();

    return user;
  }
}
