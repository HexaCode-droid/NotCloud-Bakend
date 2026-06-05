import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PageModule } from './page/page.module';


@Module({
  imports: [UserModule, AuthModule, PrismaModule, PageModule],
})
export class AppModule { }
