import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedatToUser1767570586868 implements MigrationInterface {
    name = 'AddCreatedatToUser1767570586868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "role" varchar CHECK( "role" IN ('0','1','2') ) NOT NULL DEFAULT (2), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_4baf95322bd69fe419c26c5430c" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role") SELECT "id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "role" varchar CHECK( "role" IN ('0','1','2') ) NOT NULL DEFAULT (2), CONSTRAINT "UQ_4baf95322bd69fe419c26c5430c" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role") SELECT "id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
