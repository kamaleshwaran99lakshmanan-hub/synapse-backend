import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';

@Module({
  imports: [HttpModule],
  controllers: [PredictionController], // <-- This exposes the route
  providers: [PredictionService],
  exports: [PredictionService], 
})
export class PredictionModule {}