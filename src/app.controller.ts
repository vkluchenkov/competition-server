import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  hello() {
    return 'DWW Server v0.0.1';
  }
}
