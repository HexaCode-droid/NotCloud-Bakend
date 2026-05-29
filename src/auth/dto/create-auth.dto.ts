import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  email!: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password for the user' })
  password!: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'The name of the user' })
  name?: string;
}
