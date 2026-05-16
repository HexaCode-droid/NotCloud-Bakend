import { ApiProperty } from "@nestjs/swagger";

export class AuthTokensResponseDto {
    @ApiProperty({
        description: "JWT de acceso",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    token!: string;

    @ApiProperty({
        description: "JWT de refresco",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    refreshToken!: string;

    @ApiProperty({
        description: "Tiempo de vida del access token en segundos",
        example: 3600,
    })
    expiresIn!: number;
}

export class LoginResponseDto {
    @ApiProperty({
        description: "ID del usuario",
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    id!: string;

    @ApiProperty({
        description: "Correo electrónico",
        example: "usuario@ejemplo.com",
    })
    email!: string;

    @ApiProperty({
        description: "Nombre completo",
        example: "Juan Pérez",
    })
    fullName!: string;

    @ApiProperty({
        description: "JWT de acceso",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    token!: string;

    @ApiProperty({
        description: "JWT de refresco",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    refreshToken!: string;

    @ApiProperty({
        description: "Tiempo de vida del access token en segundos",
        example: 3600,
    })
    expiresIn!: number;
}
