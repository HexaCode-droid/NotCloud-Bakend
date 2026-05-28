export class CreateUserDto {
  email!: string;
  password!: string;
  name?: string;
  isVerified?: boolean;
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
}
