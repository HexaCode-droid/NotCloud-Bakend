import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProblemDetailsDto {
    @ApiProperty({
        example: "https://notcloud.local/problems/conflict",
        description: "URI que identifica el tipo de problema",
    })
    type!: string;

    @ApiProperty({ example: "Conflict" })
    title!: string;

    @ApiProperty({ example: 409 })
    status!: number;

    @ApiPropertyOptional({ example: "El Usuario ya existe" })
    detail?: string;

    @ApiPropertyOptional({ example: "/auth/register" })
    instance?: string;

    @ApiPropertyOptional({
        example: ["email must be an email"],
        description: "Errores de validación (extensión)",
        type: [String],
    })
    errors?: string[];
}

/** @deprecated Usar ProblemDetailsDto */
export class ErrorResponseDto extends ProblemDetailsDto {}
