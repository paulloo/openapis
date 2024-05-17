import { IsNumber, IsOptional, IsPositive, IsString, IsMultibyte } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamWeather {

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ description: 'weather app key', required: false })
  // key: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'city', required: false })
  city: string;

}


export class ParamPets {
  
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '宠物名称(如:哈士奇)', required: false })
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '	宠物类型(默认1)，0猫科、1犬类、2爬行类、3小宠物类、4水族类', required: false })
  type: number;
  
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '翻页(默认1)', required: false })
  page: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '每页返回数量(默认5)', required: false })
  num: number;
}


export class ParamAnimalDetect {
  
  @IsOptional()
  @IsMultibyte()
  @ApiProperty({ description: '动物图片，base64编码，编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式 。注意：图片需要base64编码、去掉编码头后再进行urlencode。', required: false })
  file: Express.Multer.File;
}