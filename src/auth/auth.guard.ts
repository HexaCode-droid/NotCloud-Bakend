import {
  CanActivate,          // Interfaz que todo Guard de NestJS debe implementar
  ExecutionContext,     // Nos da acceso al contexto de la petición (HTTP, WebSocket, etc.)
  Injectable,          // Permite que NestJS lo inyecte como dependencia en otros módulos
  UnauthorizedException, // Excepción de NestJS que genera automáticamente un error 401
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Servicio para verificar y firmar tokens JWT
import { Request } from 'express';        // Tipado del objeto Request de Express

// @Injectable() le dice a NestJS que este Guard puede recibir dependencias por inyección
@Injectable()
export class AuthGuard implements CanActivate {

  // Inyectamos el JwtService para poder verificar el token recibido
  constructor(private jwtService: JwtService) {}

  // canActivate es el método principal del Guard.
  // NestJS lo llama ANTES de ejecutar el controlador.
  // Si devuelve "true", la petición pasa. Si devuelve "false" (o lanza un error), la petición se bloquea.
  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Obtenemos el objeto de la petición HTTP (el Request de Express)
    const request = context.switchToHttp().getRequest();

    // Extraemos el token del header "Authorization: Bearer <token>"
    const token = this.extractTokenFromHeader(request);

    // Si no hay token, rechazamos la petición con un error 401
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Verificamos que el token sea válido y no haya expirado.
      // Si el token es inválido o fue firmado con un secreto diferente, lanza un error.
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Si el token es válido, guardamos su "payload" (id y email del usuario)
      // dentro del objeto request para que cualquier controlador lo pueda usar después
      // con algo como: @Request() req => req.user
      request['user'] = payload;

    } catch {
      // Si la verificación falla (token expirado, firma inválida, etc.), devolvemos 401
      throw new UnauthorizedException('Invalid token');
    }

    // Si todo salió bien, devolvemos "true" y NestJS permite que la petición continúe
    return true;
  }

  // Método privado que extrae el token del header de la petición.
  // El formato estándar es: "Authorization: Bearer eyJhbGciOi..."
  // Si el tipo no es "Bearer", devolvemos undefined (sin token).
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
