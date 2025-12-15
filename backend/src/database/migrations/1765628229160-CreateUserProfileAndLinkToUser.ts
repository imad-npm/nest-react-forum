import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProfileAndLinkToUser1765628229160 implements MigrationInterface {
    name = 'CreateUserProfileAndLinkToUser1765628229160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_7bdaa0714f4c1087a926a2d8369" UNIQUE ("username"), CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId") SELECT "id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_7bdaa0714f4c1087a926a2d8369" UNIQUE ("username"), CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_profiles"("id", "username", "bio", "picture", "userId") SELECT "id", "username", "bio", "picture", "userId" FROM "user_profiles"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_profiles" RENAME TO "user_profiles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" RENAME TO "temporary_user_profiles"`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_7bdaa0714f4c1087a926a2d8369" UNIQUE ("username"), CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "user_profiles"("id", "username", "bio", "picture", "userId") SELECT "id", "username", "bio", "picture", "userId" FROM "temporary_user_profiles"`);
        await queryRunner.query(`DROP TABLE "temporary_user_profiles"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "picture" varchar, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId") SELECT "id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}
