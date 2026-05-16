import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: "Correo electrónico",
        example: "usuario@ejemplo.com",
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        description: "Contraseña",
        example: "MiPassword123",
    })
    @IsString()
    @MinLength(1)
    password!: string;
}
