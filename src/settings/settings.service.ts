import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureSettingsExist(userId: string) {
    const settings = await this.prisma.userSettings.findUnique({ where: { userId } });
    if (!settings) {
      await this.prisma.userSettings.create({ data: { userId } });
    }
  }

  async getMe(userId: string) {
    await this.ensureSettingsExist(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        settings: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.name === undefined) return this.getMe(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
    });
    return this.getMe(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Contraseña actual incorrecta');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Contraseña actualizada correctamente' };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    await this.ensureSettingsExist(userId);
    await this.prisma.userSettings.update({
      where: { userId },
      data: dto,
    });
    return this.getMe(userId);
  }
}
