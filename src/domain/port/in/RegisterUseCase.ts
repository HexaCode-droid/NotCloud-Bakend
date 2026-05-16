// Command de registro de usuario: Lo que anota el usuario
export type RegisterCommand = {
    fullName: string;
    email: string;
    password: string;
};

// Retorno de Token de acceso
export type RegisterSuccess = {
    token: string;
    RefreshToken: string;
    expiresIn: number;
};

// Coso de uso de registro de usuario
export interface RegisterUseCase {
    execute(command: RegisterCommand): Promise<RegisterSuccess>;
}
