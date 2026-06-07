import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}

  // Crea una nueva página para el usuario autenticado
  async create(userId: string, createPageDto: CreatePageDto) {
    return this.prisma.page.create({
      data: {
        title: createPageDto.title ?? 'Sin título',
        icon: createPageDto.icon,
        cover: createPageDto.cover,
        isFavorite: createPageDto.isFavorite ?? false,
        parentPageId: createPageDto.parentPageId ?? null,
        userId,
      },
    });
  }

  // Retorna todas las páginas raíz (sin padre) del usuario
  async findAll(userId: string) {
    return this.prisma.page.findMany({
      where: {
        userId,
        parentPageId: null,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        // Incluimos las sub-páginas de primer nivel para la barra lateral
        subPages: {
          where: { isArchived: false },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
            icon: true,
            isFavorite: true,
            parentPageId: true,
          },
        },
        _count: {
          select: { blocks: true },
        },
      },
    });
  }

  // Retorna una página específica con todos sus bloques y sub-páginas
  async findOne(userId: string, id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
        subPages: {
          where: { isArchived: false },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
            icon: true,
            isFavorite: true,
            parentPageId: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException(`Página con ID "${id}" no encontrada`);
    }

    // Verificamos que la página pertenezca al usuario autenticado
    if (page.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta página');
    }

    return page;
  }

  // Retorna todas las páginas marcadas como favoritas del usuario
  async findFavorites(userId: string) {
    return this.prisma.page.findMany({
      where: {
        userId,
        isFavorite: true,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        icon: true,
        isFavorite: true,
        parentPageId: true,
      },
    });
  }

  // Retorna las páginas archivadas del usuario (papelera)
  async findArchived(userId: string) {
    return this.prisma.page.findMany({
      where: {
        userId,
        isArchived: true,
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        icon: true,
        updatedAt: true,
      },
    });
  }

  // Retorna las páginas recientes (raíz o sub-páginas)
  async findRecent(userId: string) {
    return this.prisma.page.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        icon: true,
        isFavorite: true,
        parentPageId: true,
        updatedAt: true,
      },
    });
  }

  // Actualiza los datos de una página
  async update(userId: string, id: string, updatePageDto: UpdatePageDto) {
    await this.findOne(userId, id);

    if (updatePageDto.isArchived === true) {
      const descendantIds = await this.collectDescendantIds(id);
      const { isArchived: _isArchived, ...rest } = updatePageDto;

      await this.prisma.page.updateMany({
        where: { id: { in: [id, ...descendantIds] }, userId },
        data: {
          ...rest,
          isArchived: true,
          isFavorite: false,
        },
      });

      return this.prisma.page.findUnique({ where: { id } });
    }

    return this.prisma.page.update({
      where: { id },
      data: updatePageDto,
    });
  }

  // Elimina permanentemente una página (solo si está en la papelera)
  async remove(userId: string, id: string) {
    const page = await this.findOne(userId, id);

    if (!page.isArchived) {
      throw new BadRequestException(
        'La página debe estar en la papelera para eliminarla permanentemente',
      );
    }

    await this.prisma.page.delete({
      where: { id },
    });

    return { message: 'Página eliminada permanentemente' };
  }

  private async collectDescendantIds(pageId: string): Promise<string[]> {
    const children = await this.prisma.page.findMany({
      where: { parentPageId: pageId },
      select: { id: true },
    });

    const descendantIds: string[] = [];

    for (const child of children) {
      descendantIds.push(child.id);
      descendantIds.push(...(await this.collectDescendantIds(child.id)));
    }

    return descendantIds;
  }
}
