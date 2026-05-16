import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigService } from "../../../../config/app-config.service";
import { TypeOrmUserRepository } from "./adapter/typeorm-user.repository";
import { UserOrmEntity } from "./entity/user.orm-entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [AppConfigService],
            useFactory: (appConfig: AppConfigService) => ({
                type: "postgres",
                host: appConfig.database.host,
                port: appConfig.database.port,
                username: appConfig.database.username,
                password: appConfig.database.password,
                database: appConfig.database.database,
                entities: [UserOrmEntity],
                synchronize: appConfig.database.synchronize,
            }),
        }),
        TypeOrmModule.forFeature([UserOrmEntity]),
    ],
    providers: [TypeOrmUserRepository],
    exports: [TypeOrmUserRepository],
})
export class PersistenceModule {}
