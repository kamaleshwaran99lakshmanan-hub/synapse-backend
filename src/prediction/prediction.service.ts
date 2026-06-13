import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(private readonly httpService: HttpService) {}

  async getLayoffPrediction(ticker: string) {
    const url = `${process.env.ML_API_URL}/predict`;

    try {
      // First attempt
      const response = await lastValueFrom(
        this.httpService.post(
          url,
          { ticker },
          {
            timeout: 100000,
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.warn(
        'ML service appears to be sleeping. Waiting for Render cold start...',
      );

      // Wait 70 seconds for Render free tier to wake up
      await new Promise((resolve) => setTimeout(resolve, 70000));

      try {
        // Second attempt
        const retryResponse = await lastValueFrom(
          this.httpService.post(
            url,
            { ticker },
            {
              timeout: 100000,
            },
          ),
        );

        return retryResponse.data;
      } catch (retryError) {
        this.logger.error(
          'ML service failed even after waiting.',
          retryError,
        );

        throw new HttpException(
          'ML Engine is still starting. Please try again in a few moments.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }
  }
}