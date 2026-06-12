import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get(':ticker')
  async getRisk(@Param('ticker') ticker: string) {
    if (!ticker) {
      throw new HttpException('Ticker is required', HttpStatus.BAD_REQUEST);
    }
    
    // Forwards the ticker to the service
    return this.predictionService.getLayoffPrediction(ticker.toUpperCase());
  }
}