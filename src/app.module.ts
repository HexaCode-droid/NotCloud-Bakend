import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PageModule } from './page/page.module';
import { BlockModule } from './block/block.module';
import { SettingsModule } from './settings/settings.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    PrismaModule,
    PageModule,
    BlockModule,
    SettingsModule,
    RemindersModule,
  ],
})
export class AppModule {}
