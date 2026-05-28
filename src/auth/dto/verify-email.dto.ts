import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'The verification code sent to the email' })
  code!: string;
}
