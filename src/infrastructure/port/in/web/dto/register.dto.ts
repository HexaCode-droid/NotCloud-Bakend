import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description: "Nombre completo del usuario",
        example: "Juan Pérez",
        minLength: 2,
    })
    @IsString()
    @MinLength(2)
    fullName!: string;

    @ApiProperty({
        description: "Correo electrónico",
        example: "usuario@ejemplo.com",
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        description: "Contraseña",
        example: "MiPassword123",
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    password!: string;
}
