export class InvalidCredentialsException extends Error {
    constructor() {
        super("Las credenciales proporcionadas son incorrectas")
        this.name = "InvalidCredentialsException";
    }
}