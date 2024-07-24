import { IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamWeather {

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'city', required: false })
  city: string;

}
