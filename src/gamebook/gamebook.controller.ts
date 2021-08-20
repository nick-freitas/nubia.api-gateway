import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GamebookService } from './gamebook.service';

@Controller('api/gamebook')
export class GamebookController {
  constructor(private service: GamebookService) {}

  @Get('/')
  getGamebook(): Observable<any> {
    return this.service.getGamebook();
  }
}
