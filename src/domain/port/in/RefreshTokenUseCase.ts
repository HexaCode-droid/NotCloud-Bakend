export type RefreshTokenCommand = {
    refreshToken: string;
};

export type RefreshTokenSuccess = {
    token: string;
    refreshToken: string;
    expiresIn: number;
};

export interface RefreshTokenUseCase {
    execute(command: RefreshTokenCommand): Promise<RefreshTokenSuccess>;
}
