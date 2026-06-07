import { ApiProperty } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty({ example: 'Revisar apuntes de matemáticas' })
  title!: string;

  @ApiProperty({ example: 'Repasar capítulo 3', required: false })
  description?: string;

  @ApiProperty({ example: '2026-06-10T09:00:00.000Z' })
  remindAt!: string;
}
