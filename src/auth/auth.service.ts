import { uuid } from 'uuidv4';
import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import {
  Topics,
  User,
  UserEvent,
  UserEventType,
} from '@indigobit/nubia.common';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthService {
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
  ): Promise<any> {
    const payload: UserEvent = {
      type: UserEventType.CREATE_USER,
      data: {
        email,
        password,
        fullName,
        id: uuid(),
        version: 1,
      },
    };

    const user = await this.authClient
      .send<Partial<User>>(Topics.USERS, payload)
      .toPromise();

    await this.authClient
      .send<string>(Topics.USERS, {
        type: UserEventType.USER_CREATED,
        data: user,
      })
      .pipe(map((message: string) => console.info(message)))
      .toPromise();

    return user;
  }

  updateUser(id: string, fullName: string): Observable<any> {
    const payload: UserEvent = {
      type: UserEventType.UPDATE_USER,
      data: {
        id,
        fullName,
        version: 0,
      },
    };

    return this.authClient.send<Partial<User>>(Topics.USERS, payload);
  }
}
