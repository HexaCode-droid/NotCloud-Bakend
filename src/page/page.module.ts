import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule, // Necesario para que el AuthGuard pueda verificar el token
  ],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
