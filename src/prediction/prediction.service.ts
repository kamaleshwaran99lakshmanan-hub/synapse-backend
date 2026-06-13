import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(private readonly httpService: HttpService) {}

  async getLayoffPrediction(ticker: string) {
  const url = `${process.env.ML_API_URL}/predict`;
 console.log("ML URL:", url);
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
    } catch (error:any) {
  console.log(error);
  console.log(error.response?.data);
  console.log(error.code);
  console.log(error.message);

  this.logger.error(error);

  throw new HttpException(
    'ML Engine is starting. Please try again in a few seconds.',
    HttpStatus.SERVICE_UNAVAILABLE,
  );
}
  }
}
}