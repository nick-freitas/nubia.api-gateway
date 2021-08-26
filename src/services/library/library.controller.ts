import { Controller, Get, UseGuards } from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private service: LibraryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getLibrary(@Auth() auth): Promise<any> {
    return this.service.getLibrary(auth);
  }
}
