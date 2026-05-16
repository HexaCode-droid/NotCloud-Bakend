import { User } from "../../../../../domain/model/User";
import { UserOrmEntity } from "../entity/user.orm-entity";

export class UserMapper {
    static toDomain(entity: UserOrmEntity): User {
        return User.restore({
            id: entity.id,
            email: entity.email,
            fullName: entity.fullName,
            passwordHash: entity.password,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toPersistence(user: User): UserOrmEntity {
        const entity = new UserOrmEntity();
        entity.id = user.getId();
        entity.email = user.getEmail();
        entity.fullName = user.getFullName();
        entity.password = user.getPassword();
        entity.createdAt = user.getCreatedAt();
        entity.updatedAt = user.getUpdatedAt();
        return entity;
    }
}
