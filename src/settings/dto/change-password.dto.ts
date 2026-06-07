import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'MiPasswordActual123' })
  currentPassword!: string;

  @ApiProperty({ example: 'MiNuevaPassword456' })
  newPassword!: string;
}
