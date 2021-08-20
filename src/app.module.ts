import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamebookModule } from './gamebook/gamebook.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [AuthModule, GamebookModule, LibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
