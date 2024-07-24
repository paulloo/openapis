import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleapisService } from '../services/googleapis.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('GoogleApis')
@Controller('googleapis')
export class GoogleapisController {
  constructor(private readonly googleapisService: GoogleapisService) {}

  @Get('qiniu')
  @ApiOperation({ summary: '通过城市名称或城市ID查询天气预报情况' })
  async qiniuUpload() {
    return this.googleapisService.qiniuUpload();
  }

  
}
