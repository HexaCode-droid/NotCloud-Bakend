import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AppConfiguration } from "./configuration";

@Injectable()
export class AppConfigService {
    constructor(private readonly config: ConfigService<AppConfiguration, true>) {}

    get jwt(): AppConfiguration["jwt"] {
        return this.config.get("jwt", { infer: true });
    }

    get bcrypt(): AppConfiguration["bcrypt"] {
        return this.config.get("bcrypt", { infer: true });
    }

    get database(): AppConfiguration["database"] {
        return this.config.get("database", { infer: true });
    }

    get cors(): AppConfiguration["cors"] {
        return this.config.get("cors", { infer: true });
    }

    get swagger(): AppConfiguration["swagger"] {
        return this.config.get("swagger", { infer: true });
    }
}
