import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
