export type LoginCommand = {
    email: string;
    password: string;
};

export type LoginSuccess = {
    id: string;
    email: string;
    fullName: string;
};

export interface LoginUseCase{
    execute(command: LoginCommand): Promise<LoginSuccess>;
}
