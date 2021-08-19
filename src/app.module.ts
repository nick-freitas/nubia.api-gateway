import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'nubia.dev/services/auth',
          port: 8888,
        },
      },
      {
        name: 'GAMEBOOK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'nubia.dev/services/gamebook',
          port: 8888,
        },
      },
      {
        name: 'LIBRARY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'nubia.dev/services/library',
          port: 8888,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
