import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersScheduler {
  private readonly logger = new Logger(RemindersScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async dispatchDueReminders() {
    const now = new Date();

    try {
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
        await this.sendReminderEmail(reminder);
        
        await this.prisma.reminder.update({
          where: { id: reminder.id },
          data: { emailNotified: true },
        });
      }
    } catch (error) {
      this.logger.error('Error dispatching reminders', error);
    }
  }

  private async sendReminderEmail(reminder: any) {
    try {
      await this.mailerService.sendMail({
        to: reminder.user.email,
        subject: `🔔 Recordatorio: ${reminder.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Hola ${reminder.user.name || 'Usuario'},</h2>
            <p>Tienes un recordatorio programado:</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <h3 style="margin-top: 0;">${reminder.title}</h3>
              ${reminder.description ? `<p>${reminder.description}</p>` : ''}
              <p style="font-size: 12px; color: #666;">Programado para: ${reminder.remindAt.toLocaleString('es-ES')}</p>
            </div>
            <p>El equipo de NotCloud</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(`Error enviando email a ${reminder.user.email}`, error);
    }
  }
}
