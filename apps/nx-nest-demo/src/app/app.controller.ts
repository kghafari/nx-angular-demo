import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('some-data')
  getData() {
    return this.appService.getData();
  }

  @Get('test')
  getTest() {
    return "Hello Test!";
  }
}
