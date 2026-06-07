import { ApiProperty } from '@nestjs/swagger';
import { Theme } from '@prisma/client';

export class UpdatePreferencesDto {
  @ApiProperty({ enum: Theme, required: false })
  theme?: Theme;

  @ApiProperty({ example: 'es-ES', required: false })
  locale?: string;

  @ApiProperty({ example: 'Europe/Madrid', required: false })
  timezone?: string;

  @ApiProperty({ required: false })
  emailNotifications?: boolean;

  @ApiProperty({ required: false })
  browserNotifications?: boolean;

  @ApiProperty({ required: false })
  reminderNotifications?: boolean;
}
