import { IsArray, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderBlockItem {
  @ApiProperty({ example: 'uuid-del-bloque' })
  @IsString()
  id: string;

  @ApiProperty({ example: 2, description: 'Nueva posición del bloque' })
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderBlocksDto {
  @ApiProperty({
    type: [ReorderBlockItem],
    description: 'Lista de bloques con sus nuevas posiciones',
    example: [
      { id: 'uuid-1', order: 0 },
      { id: 'uuid-2', order: 1 },
    ],
  })
  @IsArray()
  blocks: ReorderBlockItem[];
}
