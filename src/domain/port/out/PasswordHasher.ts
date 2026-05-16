export interface PasswordHasher {
    hash(password: string): Promise<string>;
    match(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
