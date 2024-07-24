import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpClientService } from '@tresdoce-nestjs-toolkit/http-client';

@Injectable()
export class GoogleapisService {
  constructor(
    private readonly httpClient: HttpClientService,
  ) {}
  async qiniuUpload() {
    try {
      return 'weat'
    } catch (error) /* istanbul ignore next */ {
      throw new HttpException(error.response.data, error.response.status);
    }
  }
  
}
