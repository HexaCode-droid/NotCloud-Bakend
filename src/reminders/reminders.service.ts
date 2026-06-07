import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, from?: string, to?: string) {
    const whereClause: any = { userId };
    
    if (from || to) {
      whereClause.remindAt = {};
      if (from) whereClause.remindAt.gte = new Date(from);
      if (to) whereClause.remindAt.lte = new Date(to);
    }

    return this.prisma.reminder.findMany({
      where: whereClause,
      orderBy: { remindAt: 'asc' },
    });
  }

  async findUpcoming(userId: string) {
    const now = new Date();
    const futureLimit = new Date(now.getTime() + 60 * 60 * 1000); // Next 1 hour

    return this.prisma.reminder.findMany({
      where: {
        userId,
        browserNotified: false,
        remindAt: { lte: futureLimit },
        user: {
          settings: {
            browserNotifications: true,
            reminderNotifications: true,
          },
        },
      },
      orderBy: { remindAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateReminderDto) {
    const remindAt = new Date(dto.remindAt);
    if (isNaN(remindAt.getTime())) throw new BadRequestException('Fecha inválida');

    return this.prisma.reminder.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        remindAt,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateReminderDto) {
    await this.verifyOwnership(userId, id);
    
    const dataToUpdate: any = { ...dto };
    if (dto.remindAt) {
      const remindAt = new Date(dto.remindAt);
      if (isNaN(remindAt.getTime())) throw new BadRequestException('Fecha inválida');
      dataToUpdate.remindAt = remindAt;
      dataToUpdate.browserNotified = false;
      dataToUpdate.emailNotified = false;
    }

    return this.prisma.reminder.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(userId: string, id: string) {
    await this.verifyOwnership(userId, id);
    await this.prisma.reminder.delete({ where: { id } });
    return { success: true };
  }

  async markBrowserNotified(userId: string, id: string) {
    await this.verifyOwnership(userId, id);
    return this.prisma.reminder.update({
      where: { id },
      data: { browserNotified: true },
    });
  }

  private async verifyOwnership(userId: string, id: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });
    if (!reminder) throw new NotFoundException('Recordatorio no encontrado');
    if (reminder.userId !== userId) throw new ForbiddenException('No autorizado');
    return reminder;
  }
}
