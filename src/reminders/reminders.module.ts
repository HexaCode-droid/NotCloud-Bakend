import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RemindersController } from './reminders.controller';
import { RemindersScheduler } from './reminders.scheduler';
import { RemindersService } from './reminders.service';

@Module({
  imports: [AuthModule],
  controllers: [RemindersController],
  providers: [RemindersService, RemindersScheduler],
})
export class RemindersModule {}
