import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) { }

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, name } = createAuthDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(verificationCodeExpiresAt.getMinutes() + 15);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      isVerified: false,
      verificationCode,
      verificationCodeExpiresAt,
    });

    const emailHtml = `
      <div style="font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 50px 20px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
          <!-- Header -->
          <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
            <h1 style="margin: 0; color: #000000; font-size: 34px; font-weight: 800; letter-spacing: -0.5px;">NotCloud</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; text-align: center; margin-top: 0; margin-bottom: 20px;">¡Bienvenido a bordo!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 35px;">
              Estamos emocionados de tenerte aquí. Para empezar a crear, organizar y guardar todos tus apuntes e ideas, por favor verifica tu cuenta usando tu código de seguridad personal:
            </p>
            
            <!-- Code Box -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; text-align: center; margin: 0 auto; max-width: 320px;">
              <span style="display: block; font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; color: #2563eb; letter-spacing: 12px; margin-left: 12px;">
                ${verificationCode}
              </span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 35px;">
              Este código es válido por los próximos <strong>15 minutos</strong>.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
              Si no solicitaste este registro, por favor ignora este correo de forma segura.<br>
              © 2026 NotCloud. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: '¡Bienvenido a NotCloud! Verifica tu correo electrónico',
        text: `¡Bienvenido a NotCloud :D! Tu código de verificación es: ${verificationCode}. Este código expirará en 15 minutos.`,
        html: emailHtml,
      });
    } catch (error) {
      console.error('Error sending email', error);
    }

    return {
      message: 'User successfully registered. Please check your email for the verification code.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or code');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (user.verificationCodeExpiresAt && user.verificationCodeExpiresAt < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    await this.usersService.update(user.id, {
      isVerified: true,
      verificationCode: null as unknown as string,
      verificationCodeExpiresAt: null as unknown as Date,
    });

    const payload = { sub: user.id, email: user.email };
    return {
      message: 'Email successfully verified.',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
