import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { LoginUseCase } from "../../../../../domain/port/in/LoginUseCase";
import type { RegisterUseCase } from "../../../../../domain/port/in/RegisterUseCase";
import type { RefreshTokenUseCase } from "../../../../../domain/port/in/RefreshTokenUseCase";
import { AuthTokensResponseDto, LoginResponseDto } from "../dto/auth-response.dto";
import { ProblemDetailsDto } from "../dto/error-response.dto";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { RegisterDto } from "../dto/register.dto";
import { AuthMapper } from "../mapper/auth.mapper";

export const REGISTER_USE_CASE = "RegisterUseCase";
export const LOGIN_USE_CASE = "LoginUseCase";
export const REFRESH_TOKEN_USE_CASE = "RefreshTokenUseCase";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        @Inject(REGISTER_USE_CASE)
        private readonly registerUseCase: RegisterUseCase,
        @Inject(LOGIN_USE_CASE)
        private readonly loginUseCase: LoginUseCase,
        @Inject(REFRESH_TOKEN_USE_CASE)
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
    ) {}

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Registrar un nuevo usuario" })
    @ApiCreatedResponse({
        description: "Usuario creado y tokens generados",
        type: AuthTokensResponseDto,
    })
    @ApiConflictResponse({
        description: "El correo ya está registrado",
        type: ProblemDetailsDto,
    })
    @ApiBadRequestResponse({
        description: "Datos de entrada inválidos",
        type: ProblemDetailsDto,
    })
    async register(@Body() body: RegisterDto): Promise<AuthTokensResponseDto> {
        const result = await this.registerUseCase.execute(AuthMapper.toRegisterCommand(body));
        return AuthMapper.toAuthTokensResponse(result);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Iniciar sesión" })
    @ApiOkResponse({
        description: "Credenciales válidas — usuario y tokens",
        type: LoginResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: "Correo o contraseña incorrectos",
        type: ProblemDetailsDto,
    })
    @ApiBadRequestResponse({
        description: "Datos de entrada inválidos",
        type: ProblemDetailsDto,
    })
    async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
        const result = await this.loginUseCase.execute(AuthMapper.toLoginCommand(body));
        return AuthMapper.toLoginResponse(result);
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Renovar tokens con el refresh token" })
    @ApiOkResponse({
        description: "Nuevos tokens generados",
        type: AuthTokensResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: "Refresh token inválido o expirado",
        type: ProblemDetailsDto,
    })
    @ApiBadRequestResponse({
        description: "Datos de entrada inválidos",
        type: ProblemDetailsDto,
    })
    async refresh(@Body() body: RefreshTokenDto): Promise<AuthTokensResponseDto> {
        const result = await this.refreshTokenUseCase.execute(
            AuthMapper.toRefreshTokenCommand(body),
        );
        return AuthMapper.toAuthTokensResponse(result);
    }
}
