export type LoginCommand = {
    email: string;
    password: string;
};

export type LoginSuccess = {
    id: string;
    email: string;
    fullName: string;
    token: string;
    refreshToken: string;
    expiresIn: number;
};

export interface LoginUseCase {
    execute(command: LoginCommand): Promise<LoginSuccess>;
}
