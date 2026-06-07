import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AiCompleteDto {
  @ApiProperty({ example: '¿Qué es SQL?' })
  @IsNotEmpty()
  @IsString()
  prompt!: string;

  @ApiProperty({ example: 'Este es el contexto de la nota...', required: false })
  @IsOptional()
  @IsString()
  context?: string;
}
