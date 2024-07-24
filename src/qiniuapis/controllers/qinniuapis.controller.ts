import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QiniuapisService } from '../services/qinniuapis.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParamUploadByUrl } from '../dtos/qiniuapis.dto';

@ApiTags('QiniuApis')
@Controller('qiniuapis')
export class QiniuapisController {
  constructor(private readonly qinniuapisService: QiniuapisService) {}

  @Post('upload')
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
  @ApiOperation({ summary: '七牛云上传文件' })
  async qiniuUpload(@UploadedFile() file: Express.Multer.File) {
    return this.qinniuapisService.qiniuUpload(file);
  }

  @Post('/uploadByUrl')
  @ApiOperation({ summary: '七牛云上传文件url' })
  async qiniuUploadByUrl(@Body() file: ParamUploadByUrl) {
    return this.qinniuapisService.qiniuUploadByUrl(file);
  }

}
