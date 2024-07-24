import { IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamUploadByUrl {

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'url', required: false })
  url: string;

}
