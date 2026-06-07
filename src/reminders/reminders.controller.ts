import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { RemindersService } from './reminders.service';

@ApiTags('reminders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar recordatorios del usuario' })
  findAll(
    @Request() req: { user: { sub: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.remindersService.findAll(req.user.sub, from, to);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Recordatorios pendientes de notificación en navegador' })
  findUpcoming(@Request() req: { user: { sub: string } }) {
    return this.remindersService.findUpcomingForBrowser(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un recordatorio' })
  create(
    @Request() req: { user: { sub: string } },
    @Body() dto: CreateReminderDto,
  ) {
    return this.remindersService.create(req.user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un recordatorio' })
  update(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto,
  ) {
    return this.remindersService.update(req.user.sub, id, dto);
  }

  @Patch(':id/browser-notified')
  @ApiOperation({ summary: 'Marcar recordatorio como notificado en navegador' })
  markBrowserNotified(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
  ) {
    return this.remindersService.markBrowserNotified(req.user.sub, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un recordatorio' })
  remove(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.remindersService.remove(req.user.sub, id);
  }
}
