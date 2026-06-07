import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AiService } from './ai.service';
import { AiCompleteDto } from './dto/ai-complete.dto';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('complete')
  @ApiOperation({ summary: 'Generar contenido con IA (Groq)' })
  async complete(@Body() dto: AiCompleteDto) {
    const text = await this.aiService.complete(dto.prompt, dto.context);
    return { text };
  }
}
