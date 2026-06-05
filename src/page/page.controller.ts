import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pages')
@ApiBearerAuth()
@UseGuards(AuthGuard) // Todas las rutas de páginas requieren autenticación
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva página' })
  @ApiResponse({ status: 201, description: 'Página creada exitosamente' })
  create(@Request() req: any, @Body() createPageDto: CreatePageDto) {
    return this.pageService.create(req.user.sub, createPageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las páginas raíz del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de páginas raíz con sus sub-páginas' })
  findAll(@Request() req: any) {
    return this.pageService.findAll(req.user.sub);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Obtener todas las páginas marcadas como favoritas' })
  @ApiResponse({ status: 200, description: 'Lista de páginas favoritas' })
  findFavorites(@Request() req: any) {
    return this.pageService.findFavorites(req.user.sub);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Obtener las páginas en la papelera (archivadas)' })
  @ApiResponse({ status: 200, description: 'Lista de páginas archivadas' })
  findArchived(@Request() req: any) {
    return this.pageService.findArchived(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una página por su ID (con bloques y sub-páginas)' })
  @ApiResponse({ status: 200, description: 'Página encontrada' })
  @ApiResponse({ status: 404, description: 'Página no encontrada' })
  @ApiResponse({ status: 403, description: 'Sin acceso a esta página' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.pageService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar título, ícono, portada, favorito o estado de una página' })
  @ApiResponse({ status: 200, description: 'Página actualizada' })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pageService.update(req.user.sub, id, updatePageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar permanentemente una página y su contenido' })
  @ApiResponse({ status: 200, description: 'Página eliminada' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.pageService.remove(req.user.sub, id);
  }
}
