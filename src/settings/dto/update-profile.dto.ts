import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  name?: string;
}
