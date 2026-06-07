import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil y preferencias del usuario autenticado' })
  getMe(@Request() req: { user: { sub: string } }) {
    return this.settingsService.getMe(req.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar nombre del perfil' })
  updateProfile(
    @Request() req: { user: { sub: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(req.user.sub, dto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Cambiar contraseña estando autenticado' })
  changePassword(
    @Request() req: { user: { sub: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.settingsService.changePassword(req.user.sub, dto);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Actualizar tema, idioma y notificaciones' })
  updatePreferences(
    @Request() req: { user: { sub: string } },
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.settingsService.updatePreferences(req.user.sub, dto);
  }
}
