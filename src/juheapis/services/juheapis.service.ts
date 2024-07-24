import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpClientService } from '@tresdoce-nestjs-toolkit/http-client';
import { AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { ParamWeather, ParamPets, ParamAnimalDetect } from '../dtos/juheapi.dto';
import { config } from '../../config';
import { google } from 'googleapis';

import speech from '@google-cloud/speech';


@Injectable()
export class JuheapisService {
  constructor(
    @Inject(config.KEY) private readonly appConfig: ConfigType<typeof config>,
    private readonly httpClient: HttpClientService,
  ) {
  }

  async getWeather(params?: ParamWeather): Promise<AxiosResponse> {
    try {
      const { data } = await this.httpClient.get(
        encodeURI(`${this.appConfig.services.juheAPI.url}/simpleWeather/query`),
        {
          params: {
            ...params,
            key: this.appConfig.services.juheAPI.weatherAppKey
          }
        }
      );

      return data;
    } catch (error) /* istanbul ignore next */ {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async getpets(params?: ParamPets): Promise<AxiosResponse> {
    try {
      const { data } = await this.httpClient.get(
        encodeURI(`${this.appConfig.services.juheAPI.url}/fapigx/pet/query`),
        {
          params: {
            ...params,
            key: this.appConfig.services.juheAPI.petsAppKey
          }
        }
      );

      return data;
    } catch (error) /* istanbul ignore next */ {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async animalDetect(file: Express.Multer.File): Promise<AxiosResponse> {
    try {
      const fileContent = readFileSync(file.path);
      const fileBase64 = fileContent.toString('base64');
      const { data } = await this.httpClient.post(
        encodeURI(`${this.appConfig.services.juheAPI.url}/animalDetect/index`),
        {
          params: {
            image: fileBase64,
            key: this.appConfig.services.juheAPI.animalDetectAppKey
          }
        }
      );

      return data;
    } catch (error) /* istanbul ignore next */ {
      throw new HttpException(error.response.data, error.response.status);
    }
  }
  
}
