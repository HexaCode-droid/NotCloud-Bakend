import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  // Verifica que la página exista y pertenezca al usuario
  private async verifyPageOwnership(pageId: string, userId: string) {
    const page = await this.prisma.page.findUnique({ where: { id: pageId } });
    if (!page) {
      throw new NotFoundException(`Página con ID "${pageId}" no encontrada`);
    }
    if (page.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta página');
    }
    return page;
  }

  // Verifica que el bloque exista y pertenezca a la página indicada
  private async verifyBlockOwnership(blockId: string, pageId: string) {
    const block = await this.prisma.block.findUnique({ where: { id: blockId } });
    if (!block || block.pageId !== pageId) {
      throw new NotFoundException(`Bloque con ID "${blockId}" no encontrado en esta página`);
    }
    return block;
  }

  // Agrega un nuevo bloque al final (o en la posición indicada) de una página
  async create(userId: string, pageId: string, createBlockDto: CreateBlockDto) {
    await this.verifyPageOwnership(pageId, userId);

    return this.prisma.block.create({
      data: {
        type: createBlockDto.type,
        content: createBlockDto.content ?? '',
        order: createBlockDto.order,
        pageId,
      },
    });
  }

  // Retorna todos los bloques de una página ordenados por posición
  async findAll(userId: string, pageId: string) {
    await this.verifyPageOwnership(pageId, userId);

    return this.prisma.block.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });
  }

  // Actualiza el contenido o tipo de un bloque específico
  async update(
    userId: string,
    pageId: string,
    blockId: string,
    updateBlockDto: UpdateBlockDto,
  ) {
    await this.verifyPageOwnership(pageId, userId);
    await this.verifyBlockOwnership(blockId, pageId);

    return this.prisma.block.update({
      where: { id: blockId },
      data: updateBlockDto,
    });
  }

  // Reordena múltiples bloques en una sola transacción (ideal para drag & drop)
  async reorder(userId: string, pageId: string, reorderBlocksDto: ReorderBlocksDto) {
    await this.verifyPageOwnership(pageId, userId);

    // Actualizamos todos los bloques en paralelo dentro de una transacción
    const updates = reorderBlocksDto.blocks.map((item) =>
      this.prisma.block.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);

    return { message: 'Bloques reordenados correctamente' };
  }

  // Elimina un bloque específico
  async remove(userId: string, pageId: string, blockId: string) {
    await this.verifyPageOwnership(pageId, userId);
    await this.verifyBlockOwnership(blockId, pageId);

    await this.prisma.block.delete({ where: { id: blockId } });

    return { message: 'Bloque eliminado correctamente' };
  }
}
