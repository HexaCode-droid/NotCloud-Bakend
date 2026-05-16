export interface TokenGeneratorPort {
    verifyRefreshToken(refreshToken: string): Promise<string>;
    generateAccessToken(payload: { userId: string }): Promise<string>;
    generateRefreshToken(payload: { userId: string }): Promise<string>;
}
