export class TokenExpired extends Error {
    constructor() {
        super("Token invalido o expirado");
        this.name = "TokenExpired";
    }
}
