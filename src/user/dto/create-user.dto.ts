export class CreateUserDto {
  email!: string;
  password!: string;
  name?: string;
  isVerified?: boolean;
  verificationCode?: string | null;
  verificationCodeExpiresAt?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}
