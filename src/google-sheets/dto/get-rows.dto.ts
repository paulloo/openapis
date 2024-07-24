import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRowsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'google spreadSheetId', required: false })
  spreadSheetId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'google sheetName', required: false })
  sheetName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'google range', required: false })
  range: string;
}