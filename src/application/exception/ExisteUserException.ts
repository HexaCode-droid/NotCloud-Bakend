export class ExisteUserException extends Error {
    constructor() {
        super("El Usuario ya existe")
        this.name = "ExisteUserException";
    }
}