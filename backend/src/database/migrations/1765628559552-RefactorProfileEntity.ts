import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorProfileEntity1765628559552 implements MigrationInterface {
    name = 'RefactorProfileEntity1765628559552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profiles"("id", "username", "bio", "picture", "userId") SELECT "id", "username", "bio", "picture", "userId" FROM "profiles"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`ALTER TABLE "temporary_profiles" RENAME TO "profiles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" RENAME TO "temporary_profiles"`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "bio" text, "picture" varchar, "userId" integer, CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "profiles"("id", "username", "bio", "picture", "userId") SELECT "id", "username", "bio", "picture", "userId" FROM "temporary_profiles"`);
        await queryRunner.query(`DROP TABLE "temporary_profiles"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
