import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParamWeather, ParamPets, ParamAnimalDetect } from '../dtos/juheapi.dto';
import { JuheapisService } from '../services/juheapis.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Juheapis')
@Controller('juheapis')
export class JuheapisController {
  constructor(private readonly juheapiService: JuheapisService) {}

  @Get('weather')
  @ApiOperation({ summary: '通过城市名称或城市ID查询天气预报情况' })
  async getWeather(@Query() params?: ParamWeather) {
    return this.juheapiService.getWeather(params);
  }

  
  @Get('pets')
  @ApiOperation({ summary: '包含猫咪、犬类、爬行动物、小动物、水族类等宠物的生活习性、喂养方法、价格、祖籍、体态特点和图片等信息。' })
  async getpets(@Query() params?: ParamPets) {
    return this.juheapiService.getpets(params);
  }

  @Post('animalDetect')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    dest: 'uploads/'
  }))
  @ApiBody({
    description: 'Animal Image',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: '根据上传的动物图片，识别动物信息。' })
  async animalDetect(@UploadedFile() file: Express.Multer.File) {
    return this.juheapiService.animalDetect(file);
  }
}
