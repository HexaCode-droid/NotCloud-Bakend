export class User {
    private constructor(
        public readonly id: string,
        public readonly email: string,
        private fullName: string,
        public readonly password: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}


    public getId(): string {
        return this.id;
    }

    public getEmail(): string {
        return this.email;
    }

    public getFullName(): string {
        return this.fullName;
    }

    public getPassword(): string {
        return this.password;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}