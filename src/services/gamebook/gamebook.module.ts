import { GamebookService } from './gamebook.service';
import { GamebookController } from './gamebook.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [GamebookController],
  providers: [GamebookService],
})
export class GamebookModule {}
