export interface AppConfiguration {
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
        expiresInSeconds: number;
    };
    bcrypt: {
        saltRounds: number;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
    };
    cors: {
        enabled: boolean;
        origin: string | string[];
        methods: string[];
        allowedHeaders: string[];
    };
    swagger: {
        enabled: boolean;
        path: string;
    };
}
