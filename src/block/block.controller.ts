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
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('blocks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
// Las rutas están anidadas bajo /pages/:pageId/blocks
@Controller('pages/:pageId/blocks')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar un bloque de contenido a una página' })
  @ApiParam({ name: 'pageId', description: 'ID de la página donde se agrega el bloque' })
  @ApiResponse({ status: 201, description: 'Bloque creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin acceso a esta página' })
  @ApiResponse({ status: 404, description: 'Página no encontrada' })
  create(
    @Request() req: any,
    @Param('pageId') pageId: string,
    @Body() createBlockDto: CreateBlockDto,
  ) {
    return this.blockService.create(req.user.sub, pageId, createBlockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los bloques de una página (ordenados por posición)' })
  @ApiParam({ name: 'pageId', description: 'ID de la página' })
  @ApiResponse({ status: 200, description: 'Lista de bloques' })
  findAll(@Request() req: any, @Param('pageId') pageId: string) {
    return this.blockService.findAll(req.user.sub, pageId);
  }

  @Patch('reorder')
  @ApiOperation({
    summary: 'Reordenar múltiples bloques en una sola operación (para drag & drop)',
  })
  @ApiParam({ name: 'pageId', description: 'ID de la página' })
  @ApiResponse({ status: 200, description: 'Bloques reordenados' })
  reorder(
    @Request() req: any,
    @Param('pageId') pageId: string,
    @Body() reorderBlocksDto: ReorderBlocksDto,
  ) {
    return this.blockService.reorder(req.user.sub, pageId, reorderBlocksDto);
  }

  @Patch(':blockId')
  @ApiOperation({ summary: 'Actualizar el contenido o tipo de un bloque' })
  @ApiParam({ name: 'pageId', description: 'ID de la página' })
  @ApiParam({ name: 'blockId', description: 'ID del bloque a actualizar' })
  @ApiResponse({ status: 200, description: 'Bloque actualizado' })
  @ApiResponse({ status: 404, description: 'Bloque o página no encontrada' })
  update(
    @Request() req: any,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    return this.blockService.update(req.user.sub, pageId, blockId, updateBlockDto);
  }

  @Delete(':blockId')
  @ApiOperation({ summary: 'Eliminar un bloque de una página' })
  @ApiParam({ name: 'pageId', description: 'ID de la página' })
  @ApiParam({ name: 'blockId', description: 'ID del bloque a eliminar' })
  @ApiResponse({ status: 200, description: 'Bloque eliminado' })
  remove(
    @Request() req: any,
    @Param('pageId') pageId: string,
    @Param('blockId') blockId: string,
  ) {
    return this.blockService.remove(req.user.sub, pageId, blockId);
  }
}
