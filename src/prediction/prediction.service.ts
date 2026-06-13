import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(private readonly httpService: HttpService) {}

  async getLayoffPrediction(ticker: string) {
  const url = `${process.env.ML_API_URL}/predict`;

  const maxRetries = 5;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          url,
          { ticker },
          {
            timeout: 15000, // 15 seconds
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.warn(`Attempt ${i + 1} failed`);

      if (i === maxRetries - 1) {
        throw new HttpException(
          'ML Engine is starting. Please try again in a few seconds.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // wait 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
}