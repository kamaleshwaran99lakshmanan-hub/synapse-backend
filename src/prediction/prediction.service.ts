import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(private readonly httpService: HttpService) {}

async getLayoffPrediction(ticker: string) {
  const url = `${process.env.ML_API_URL}/predict`;

  const maxRetries = 10;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          url,
          { ticker },
          {
            timeout: 90000,
          },
        ),
      );

      return response.data;
    } catch (error) {
      console.log(`Attempt ${attempt} failed`);

      if (attempt === maxRetries) {
        throw new HttpException(
          "ML Engine is starting. Please try again.",
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}
}