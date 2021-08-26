import { v4 as uuidv4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import {
  AuthorizedUser,
  CreateUserEvent,
  NubiaEvent,
  SignInUserEvent,
  SignOutUserEvent,
  Topics,
  UpdateUserEvent,
  User,
  UserCreatedEvent,
  UserEventType,
  UserUpdatedEvent,
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

  async signOut(auth: NubiaEvent['auth']): Promise<any> {
    const signOutPayload: SignOutUserEvent = {
      type: UserEventType.SIGN_OUT_USER,
      data: {},
      auth: auth,
    };

    console.info(
      `Sending Event -> ${signOutPayload.type}`,
      JSON.stringify(signOutPayload),
    );
    return this.authClient
      .send<any, SignOutUserEvent>(Topics.USERS, signOutPayload)
      .toPromise();
  }

  async signIn(email: string, password: string): Promise<AuthorizedUser> {
    const signInPayload: SignInUserEvent = {
      type: UserEventType.SIGN_IN_USER,
      data: {
        email,
        password,
      },
    };

    console.info(
      `Sending Event -> ${signInPayload.type}`,
      JSON.stringify(signInPayload),
    );
    const user = await this.authClient
      .send<AuthorizedUser, SignInUserEvent>(Topics.USERS, signInPayload)
      .toPromise();

    return user;
  }

  async createUser(
    email: string,
    password: string,
    fullName: string,
  ): Promise<AuthorizedUser> {
    const createPayload: CreateUserEvent = {
      type: UserEventType.CREATE_USER,
      data: {
        email,
        password,
        fullName,
        id: uuidv4(),
      },
    };

    console.info(
      `Sending Event -> ${createPayload.type}`,
      JSON.stringify(createPayload),
    );
    const user = await this.authClient
      .send<AuthorizedUser, CreateUserEvent>(Topics.USERS, createPayload)
      .toPromise();

    const createdPayload: UserCreatedEvent = {
      type: UserEventType.USER_CREATED,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        version: user.version,
      },
    };

    console.info(
      `Sending Event -> ${createdPayload.type}`,
      JSON.stringify(createdPayload),
    );
    await this.authClient
      .send<User, UserCreatedEvent>(Topics.USERS, createdPayload)
      .toPromise();

    return user;
  }

  async updateUser(
    auth: NubiaEvent['auth'],
    id: string,
    fullName: string,
  ): Promise<User> {
    const updatePayload: UpdateUserEvent = {
      type: UserEventType.UPDATE_USER,
      data: {
        id,
        fullName,
      },
      auth,
    };

    console.info(`Sending Event -> ${updatePayload.type}`);
    const user = await this.authClient
      .send<User, UpdateUserEvent>(Topics.USERS, updatePayload)
      .toPromise();

    const updatedPayload: UserUpdatedEvent = {
      type: UserEventType.USER_UPDATED,
      data: {
        id: id,
        fullName: fullName,
        version: user.version,
      },
      auth,
    };

    console.info(`Sending Event -> ${updatedPayload.type}`);
    await this.authClient
      .send<User, UserUpdatedEvent>(Topics.USERS, updatedPayload)
      .toPromise();

    return user;
  }
}
