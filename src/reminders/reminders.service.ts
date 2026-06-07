import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(userId: string, from?: string, to?: string) {
    const where: {
      userId: string;
      remindAt?: { gte?: Date; lte?: Date };
    } = { userId };

    if (from || to) {
      where.remindAt = {};
      if (from) where.remindAt.gte = new Date(from);
      if (to) where.remindAt.lte = new Date(to);
    }

    return this.prisma.reminder.findMany({
      where,
      orderBy: { remindAt: 'asc' },
    });
  }

  async findUpcomingForBrowser(userId: string) {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    return this.prisma.reminder.findMany({
      where: {
        userId,
        browserNotified: false,
        remindAt: { lte: inOneHour },
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
    if (!dto.title?.trim()) {
      throw new BadRequestException('El título es obligatorio');
    }

    const remindAt = new Date(dto.remindAt);

    if (Number.isNaN(remindAt.getTime())) {
      throw new BadRequestException('Fecha de recordatorio inválida');
    }

    if (remindAt <= new Date()) {
      throw new BadRequestException('El recordatorio debe ser en el futuro');
    }

    return this.prisma.reminder.create({
      data: {
        userId,
        title: dto.title.trim(),
        description: dto.description?.trim(),
        remindAt,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateReminderDto) {
    await this.ensureOwnership(userId, id);

    const data: {
      title?: string;
      description?: string | null;
      remindAt?: Date;
      browserNotified?: boolean;
      emailNotified?: boolean;
    } = {};

    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) data.description = dto.description?.trim() ?? null;
    if (dto.remindAt !== undefined) {
      const remindAt = new Date(dto.remindAt);
      if (Number.isNaN(remindAt.getTime())) {
        throw new BadRequestException('Fecha de recordatorio inválida');
      }
      data.remindAt = remindAt;
      data.browserNotified = false;
      data.emailNotified = false;
    }

    return this.prisma.reminder.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnership(userId, id);
    await this.prisma.reminder.delete({ where: { id } });
    return { message: 'Recordatorio eliminado' };
  }

  async markBrowserNotified(userId: string, id: string) {
    await this.ensureOwnership(userId, id);
    return this.prisma.reminder.update({
      where: { id },
      data: { browserNotified: true },
    });
  }

  async processDueEmailReminders() {
    const now = new Date();

    const dueReminders = await this.prisma.reminder.findMany({
      where: {
        emailNotified: false,
        remindAt: { lte: now },
        user: {
          settings: {
            emailNotifications: true,
            reminderNotifications: true,
          },
        },
      },
      include: {
        user: { select: { email: true, name: true } },
      },
    });

    for (const reminder of dueReminders) {
      try {
        await this.mailerService.sendMail({
          to: reminder.user.email,
          subject: `Recordatorio: ${reminder.title}`,
          text: `${reminder.title}${reminder.description ? `\n\n${reminder.description}` : ''}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px;">
              <h2>🔔 Recordatorio de NotCloud</h2>
              <p><strong>${reminder.title}</strong></p>
              ${reminder.description ? `<p>${reminder.description}</p>` : ''}
              <p style="color:#6b7280;font-size:14px;">Programado para ${reminder.remindAt.toLocaleString('es-ES')}</p>
            </div>
          `,
        });
      } catch (error) {
        console.error('Error enviando recordatorio por email', error);
        continue;
      }

      await this.prisma.reminder.update({
        where: { id: reminder.id },
        data: { emailNotified: true },
      });
    }
  }

  private async ensureOwnership(userId: string, id: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });

    if (!reminder) {
      throw new NotFoundException('Recordatorio no encontrado');
    }

    if (reminder.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a este recordatorio');
    }

    return reminder;
  }
}
