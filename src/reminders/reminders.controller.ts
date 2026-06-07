import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@ApiTags('reminders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los recordatorios' })
  findAll(@Request() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.remindersService.findAll(req.user.sub, from, to);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obtener próximos recordatorios para notificar' })
  findUpcoming(@Request() req: any) {
    return this.remindersService.findUpcoming(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Crear recordatorio' })
  create(@Request() req: any, @Body() dto: CreateReminderDto) {
    return this.remindersService.create(req.user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar recordatorio' })
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateReminderDto) {
    return this.remindersService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar recordatorio' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.remindersService.remove(req.user.sub, id);
  }

  @Patch(':id/browser-notified')
  @ApiOperation({ summary: 'Marcar como notificado en el navegador' })
  markBrowserNotified(@Request() req: any, @Param('id') id: string) {
    return this.remindersService.markBrowserNotified(req.user.sub, id);
  }
}
