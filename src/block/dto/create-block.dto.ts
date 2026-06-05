import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Espejamos el enum de Prisma para poder usarlo como valor en la doc
export enum BlockType {
  TEXT = 'TEXT',
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  TODO = 'TODO',
  IMAGE = 'IMAGE',
  CODE = 'CODE',
}

export class CreateBlockDto {
  @ApiProperty({
    enum: BlockType,
    example: BlockType.TEXT,
    description: 'Tipo de bloque de contenido',
  })
  @IsEnum(BlockType)
  type: BlockType;

  @ApiProperty({
    example: 'Este es el contenido del bloque',
    required: false,
    description: 'Contenido de texto del bloque (URL para IMAGE, código para CODE)',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: 0,
    description: 'Posición del bloque dentro de la página (0-indexed)',
  })
  @IsInt()
  @Min(0)
  order: number;
}
