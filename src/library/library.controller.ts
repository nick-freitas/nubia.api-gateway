import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private service: LibraryService) {}

  @Get('/')
  getLibrary(): Observable<any> {
    return this.service.getLibrary();
  }
}
