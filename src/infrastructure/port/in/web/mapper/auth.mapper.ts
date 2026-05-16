import type { LoginCommand, LoginSuccess } from "../../../../../domain/port/in/LoginUseCase";
import type {
    RegisterCommand,
    RegisterSuccess,
} from "../../../../../domain/port/in/RegisterUseCase";
import type {
    RefreshTokenCommand,
    RefreshTokenSuccess,
} from "../../../../../domain/port/in/RefreshTokenUseCase";
import type { LoginDto } from "../dto/login.dto";
import type { RefreshTokenDto } from "../dto/refresh-token.dto";
import type { RegisterDto } from "../dto/register.dto";
import { AuthTokensResponseDto, LoginResponseDto } from "../dto/auth-response.dto";

export class AuthMapper {
    static toRegisterCommand(dto: RegisterDto): RegisterCommand {
        return {
            fullName: dto.fullName.trim(),
            email: dto.email.trim().toLowerCase(),
            password: dto.password,
        };
    }

    static toLoginCommand(dto: LoginDto): LoginCommand {
        return {
            email: dto.email.trim().toLowerCase(),
            password: dto.password,
        };
    }

    static toRefreshTokenCommand(dto: RefreshTokenDto): RefreshTokenCommand {
        return { refreshToken: dto.refreshToken };
    }

    static toAuthTokensResponse(
        result: RegisterSuccess | RefreshTokenSuccess,
    ): AuthTokensResponseDto {
        const refreshToken = "RefreshToken" in result ? result.RefreshToken : result.refreshToken;

        return {
            token: result.token,
            refreshToken,
            expiresIn: result.expiresIn,
        };
    }

    static toLoginResponse(result: LoginSuccess): LoginResponseDto {
        return {
            id: result.id,
            email: result.email,
            fullName: result.fullName,
            token: result.token,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
        };
    }
}
