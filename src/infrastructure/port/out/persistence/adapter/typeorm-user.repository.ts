import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { User } from "../../../../../domain/model/User";
import type { UserRepository } from "../../../../../domain/port/out/UserRepository";
import { UserOrmEntity } from "../entity/user.orm-entity";
import { UserMapper } from "../mapper/user.mapper";

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repository: Repository<UserOrmEntity>,
    ) {}

    async save(user: User): Promise<void> {
        await this.repository.save(UserMapper.toPersistence(user));
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repository.findOne({
            where: { email: email.trim().toLowerCase() },
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }
}
