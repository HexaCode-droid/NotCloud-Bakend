import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ example: 'Mi primera página', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '📚', required: false, description: 'Emoji/ícono de la página' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'https://...', required: false, description: 'URL de la imagen de portada' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty({ example: null, required: false, description: 'ID de la página padre (para sub-páginas)' })
  @IsString()
  @IsOptional()
  parentPageId?: string;
}
