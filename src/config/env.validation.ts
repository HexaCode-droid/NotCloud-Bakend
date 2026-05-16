import type { AppConfiguration } from "./configuration";

export type { AppConfiguration };

const REQUIRED_ENV_KEYS = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"] as const;

export function validateEnv(config: Record<string, unknown>): AppConfiguration {
    for (const key of REQUIRED_ENV_KEYS) {
        if (!config[key] || String(config[key]).trim() === "") {
            throw new Error(`Missing or empty environment variable: ${key}`);
        }
    }

    const jwtExpiresIn = Number(config.JWT_EXPIRES_IN ?? "3600");
    if (!Number.isFinite(jwtExpiresIn) || jwtExpiresIn <= 0) {
        throw new Error("JWT_EXPIRES_IN must be a positive number");
    }

    const bcryptSaltRounds = Number(config.BCRYPT_SALT_ROUNDS ?? "10");
    if (!Number.isFinite(bcryptSaltRounds) || bcryptSaltRounds < 4) {
        throw new Error("BCRYPT_SALT_ROUNDS must be a number >= 4");
    }

    return {
        jwt: {
            accessSecret: String(config.JWT_ACCESS_SECRET),
            refreshSecret: String(config.JWT_REFRESH_SECRET),
            accessExpiresIn: String(config.JWT_ACCESS_EXPIRES_IN ?? "1h"),
            refreshExpiresIn: String(config.JWT_REFRESH_EXPIRES_IN ?? "7d"),
            expiresInSeconds: jwtExpiresIn,
        },
        bcrypt: {
            saltRounds: bcryptSaltRounds,
        },
        database: {
            host: String(config.DB_HOST ?? "localhost"),
            port: Number(config.DB_PORT ?? "5432"),
            username: String(config.DB_USERNAME ?? "postgres"),
            password: String(config.DB_PASSWORD ?? "postgres"),
            database: String(config.DB_DATABASE ?? "notcloud"),
            synchronize: config.DB_SYNCHRONIZE !== "false",
        },
        cors: {
            enabled: config.CORS_ENABLED !== "false",
            origin: parseCorsOrigin(String(config.CORS_ORIGIN ?? "*")),
            methods: parseCsv(
                String(config.CORS_METHODS ?? "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"),
            ),
            allowedHeaders: parseCsv(
                String(config.CORS_ALLOWED_HEADERS ?? "Content-Type,Authorization,Accept"),
            ),
        },
        swagger: {
            enabled: config.SWAGGER_ENABLED !== "false",
            path: String(config.SWAGGER_PATH ?? "api"),
        },
    };
}

function parseCsv(value: string): string[] {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function parseCorsOrigin(value: string): string | string[] {
    if (value === "*") {
        return "*";
    }

    const origins = parseCsv(value);
    return origins.length === 1 ? origins[0] : origins;
}
