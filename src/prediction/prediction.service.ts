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
  const response = await lastValueFrom(
    this.httpService.post(
      url,
      { ticker },
      {
        timeout: 100000,
      },
    ),
  );

  console.log("✅ First request succeeded");
  return response.data;
} catch (error:any) {
  console.log("❌ First request failed");
  console.log(error.response?.status);
  console.log(error.message);

  await new Promise(resolve => setTimeout(resolve, 70000));

  console.log("⏳ Finished waiting 70 seconds");

  try {
    const retryResponse = await lastValueFrom(
      this.httpService.post(
        url,
        { ticker },
        {
          timeout: 100000,
        },
      ),
    );

    console.log("✅ Second request succeeded");
    return retryResponse.data;
  } catch (retryError:any) {
    console.log("❌ Second request failed");
    console.log(retryError.response?.status);
    console.log(retryError.message);

    throw new HttpException(
      "ML Engine is still starting. Please try again.",
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
  }
}