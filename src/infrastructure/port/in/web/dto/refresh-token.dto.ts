import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({
        description: "Refresh token JWT",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString()
    @MinLength(1)
    refreshToken!: string;
}
