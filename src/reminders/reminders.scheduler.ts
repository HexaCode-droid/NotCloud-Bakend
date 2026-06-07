import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';

@Injectable()
export class RemindersScheduler {
  private readonly logger = new Logger(RemindersScheduler.name);

  constructor(private readonly remindersService: RemindersService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleDueReminders() {
    try {
      await this.remindersService.processDueEmailReminders();
    } catch (error) {
      this.logger.error('Error procesando recordatorios', error);
    }
  }
}
