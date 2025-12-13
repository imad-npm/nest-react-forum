import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPictureFieldToUser1765627185088 implements MigrationInterface {
    name = 'AddPictureFieldToUser1765627185088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "picture" varchar, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId") SELECT "id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId") SELECT "id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
