import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AuthModule } from './services/auth/auth.module';
import { GamebookModule } from './services/gamebook/gamebook.module';
import { LibraryModule } from './services/library/library.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    GamebookModule,
    LibraryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
