import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
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
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || 'user@example.com',
          pass: process.env.SMTP_PASS || 'password',
        },
      },
      defaults: {
        from: '"NotCloud" <noreply@notcloud.app>',
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    PageModule,
    BlockModule,
    SettingsModule,
    RemindersModule,
  ],
})
export class AppModule {}
