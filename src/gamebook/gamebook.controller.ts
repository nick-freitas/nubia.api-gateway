import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { Gamebook } from '@indigobit/nubia.common';
import { GamebookService } from './gamebook.service';

@Controller('gamebook')
export class GamebookController {
  constructor(private service: GamebookService) {}

  @Post('')
  createGamebook(@Body() gamebook: Gamebook): Promise<Partial<Gamebook>> {
    if (!gamebook.title) throw new BadRequestException('Missing Title');
    return this.service.createGamebook(gamebook);
  }

  @Get(':gamebookId')
  getById(@Param('gamebookId') gamebookId: string): Promise<Partial<Gamebook>> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');

    return this.service.getById(gamebookId);
  }

  @Post(':gamebookId/reset-choices')
  resetChoices(
    @Param('gamebookId') gamebookId: string,
  ): Promise<Partial<Gamebook>> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');

    return this.service.resetChoices(gamebookId);
  }

  @Post(':gamebookId/undo-choice')
  undoChoice(
    @Param('gamebookId') gamebookId: string,
  ): Promise<Partial<Gamebook>> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');

    return this.service.undoChoice(gamebookId);
  }

  @Post(':gamebookId/choice/:progressionId')
  makeChoice(
    @Param('gamebookId') gamebookId: string,
    @Param('progressionId') progressionId: string,
  ): Promise<Partial<Gamebook>> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');
    if (!progressionId) throw new BadRequestException('Missing ProgressionId');

    return this.service.makeChoice(gamebookId, progressionId);
  }
}
