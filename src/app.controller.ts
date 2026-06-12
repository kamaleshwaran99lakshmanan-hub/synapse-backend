import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return { 
      status: 'online',
      message: 'Synapse Backend Gateway is active. Use /api/prediction/:ticker for ML engine.'
    };
  }
}