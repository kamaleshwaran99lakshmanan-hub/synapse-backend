import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(private readonly httpService: HttpService) {}

  async getLayoffPrediction(ticker: string) {
    try {
      const url = `${process.env.ML_API_URL}/predict`; 
      
      // We must use POST and send the ticker to match your FastAPI server
      const response = await lastValueFrom(
        this.httpService.post(url, { ticker: ticker })
      );
      
      return response.data; 
    } catch (error) {
      this.logger.error('Failed to connect to ML Model API', error);
      throw new HttpException(
        'Failed to connect to Synapse ML Engine', 
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}