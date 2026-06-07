import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async complete(prompt: string, context?: string): Promise<string> {
    const systemPrompt = `Eres un asistente de escritura integrado en NotCloud, una aplicación de notas.
Tu trabajo es ayudar al usuario a escribir contenido claro, conciso y útil.
- Responde siempre en el mismo idioma que la pregunta del usuario.
- Si el usuario hace una pregunta, responde directamente con la información.
- Si pide que escriba algo, genera el texto listo para copiar a la nota.
- Sé conciso: respuestas cortas y directas. Máximo 3-4 párrafos.
- No incluyas encabezados como "Respuesta:" ni explicaciones meta, ve directo al contenido.
${context ? `\nContexto actual de la nota:\n${context}` : ''}`;

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content ?? '';
  }
}
