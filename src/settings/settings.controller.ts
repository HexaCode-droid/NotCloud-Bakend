import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { SettingsService } from './settings.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil y configuraciones' })
  getMe(@Request() req: any) {
    return this.settingsService.getMe(req.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar perfil' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.settingsService.updateProfile(req.user.sub, dto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.settingsService.changePassword(req.user.sub, dto);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Actualizar preferencias' })
  updatePreferences(@Request() req: any, @Body() dto: UpdatePreferencesDto) {
    return this.settingsService.updatePreferences(req.user.sub, dto);
  }
}
