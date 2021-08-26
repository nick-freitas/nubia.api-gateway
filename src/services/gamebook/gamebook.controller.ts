import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Gamebook } from '@indigobit/nubia.common';
import { GamebookService } from './gamebook.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Auth } from '../../decorators/auth.decorator';

@Controller('gamebook')
export class GamebookController {
  constructor(private service: GamebookService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  createGamebook(@Auth() auth, @Body() gamebook: Gamebook): Promise<Gamebook> {
    if (!gamebook.title) throw new BadRequestException('Missing Title');
    const { title, description, imageSrc, price } = gamebook;
    return this.service.createGamebook(
      auth,
      title,
      description,
      imageSrc,
      price,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':gamebookId')
  getById(
    @Auth() auth,
    @Param('gamebookId') gamebookId: string,
  ): Promise<Gamebook> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');

    return this.service.getGamebookById(auth, gamebookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gamebookId/reset-choices')
  resetChoices(
    @Auth() auth,
    @Param('gamebookId') gamebookId: string,
  ): Promise<Gamebook> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');

    return this.service.resetChoices(auth, gamebookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gamebookId/undo-choice')
  undoChoice(
    @Auth() auth,
    @Param('gamebookId') gamebookId: string,
  ): Promise<Gamebook> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');

    return this.service.undoChoice(auth, gamebookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gamebookId/choice/:progressionId')
  makeChoice(
    @Auth() auth,
    @Param('gamebookId') gamebookId: string,
    @Param('progressionId') progressionId: string,
  ): Promise<Gamebook> {
    if (!gamebookId) throw new BadRequestException('Missing GamebookId');
    if (!progressionId) throw new BadRequestException('Missing ProgressionId');

    return this.service.makeChoice(auth, gamebookId, progressionId);
  }
}
