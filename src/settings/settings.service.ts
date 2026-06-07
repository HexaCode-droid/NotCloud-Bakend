import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...USER_SELECT,
        settings: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.settings) {
      const settings = await this.createDefaultSettings(userId);
      return { ...user, settings };
    }

    return user;
  }

  async createDefaultSettings(userId: string) {
    return this.prisma.userSettings.create({
      data: { userId },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!dto.name?.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name.trim() },
      select: {
        ...USER_SELECT,
        settings: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (!dto.currentPassword || !dto.newPassword) {
      throw new BadRequestException('Contraseña actual y nueva son obligatorias');
    }

    if (dto.newPassword.length < 8) {
      throw new BadRequestException('La nueva contraseña debe tener al menos 8 caracteres');
    }

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);

    if (!isValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    await this.ensureSettings(userId);

    const settings = await this.prisma.userSettings.update({
      where: { userId },
      data: dto,
    });

    return settings;
  }

  private async ensureSettings(userId: string) {
    const existing = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!existing) {
      await this.createDefaultSettings(userId);
    }
  }
}
