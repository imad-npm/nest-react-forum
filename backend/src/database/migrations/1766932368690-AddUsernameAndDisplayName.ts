import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameAndDisplayName1766932368690 implements MigrationInterface {
    name = 'AddUsernameAndDisplayName1766932368690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "displayName" varchar NOT NULL, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_963eb0a3184ae150f3346445bac" UNIQUE ("displayName"), CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profiles"("id", "displayName", "bio", "picture", "userId") SELECT "id", "username", "bio", "picture", "userId" FROM "profiles"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`ALTER TABLE "temporary_profiles" RENAME TO "profiles"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "role" varchar CHECK( "role" IN ('0','1','2') ) NOT NULL DEFAULT (2), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role") SELECT "id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId", "role" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "role" varchar CHECK( "role" IN ('0','1','2') ) NOT NULL DEFAULT (2), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_4baf95322bd69fe419c26c5430c" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role") SELECT "id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "role" varchar CHECK( "role" IN ('0','1','2') ) NOT NULL DEFAULT (2), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role") SELECT "id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar, "emailVerifiedAt" datetime, "provider" varchar CHECK( "provider" IN ('google','github') ), "providerId" varchar, "role" varchar CHECK( "role" IN ('0','1','2') ) NOT NULL DEFAULT (2), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "password", "emailVerifiedAt", "provider", "providerId", "role") SELECT "id", "username", "email", "password", "emailVerifiedAt", "provider", "providerId", "role" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "profiles" RENAME TO "temporary_profiles"`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "profiles"("id", "username", "bio", "picture", "userId") SELECT "id", "displayName", "bio", "picture", "userId" FROM "temporary_profiles"`);
        await queryRunner.query(`DROP TABLE "temporary_profiles"`);
    }

}
