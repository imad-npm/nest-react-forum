import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailChangeTokensTable1767215182662 implements MigrationInterface {
    name = 'AddEmailChangeTokensTable1767215182662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_change_tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "newEmail" varchar(100) NOT NULL, "token" varchar NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_04e0f8c19f839970ea29cfebc40" UNIQUE ("token"))`);
        await queryRunner.query(`CREATE TABLE "temporary_email_change_tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "newEmail" varchar(100) NOT NULL, "token" varchar NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_04e0f8c19f839970ea29cfebc40" UNIQUE ("token"), CONSTRAINT "FK_5079c637bc96fe23c8aa4ccd7da" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_email_change_tokens"("id", "newEmail", "token", "expiresAt", "userId", "createdAt") SELECT "id", "newEmail", "token", "expiresAt", "userId", "createdAt" FROM "email_change_tokens"`);
        await queryRunner.query(`DROP TABLE "email_change_tokens"`);
        await queryRunner.query(`ALTER TABLE "temporary_email_change_tokens" RENAME TO "email_change_tokens"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_change_tokens" RENAME TO "temporary_email_change_tokens"`);
        await queryRunner.query(`CREATE TABLE "email_change_tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "newEmail" varchar(100) NOT NULL, "token" varchar NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_04e0f8c19f839970ea29cfebc40" UNIQUE ("token"))`);
        await queryRunner.query(`INSERT INTO "email_change_tokens"("id", "newEmail", "token", "expiresAt", "userId", "createdAt") SELECT "id", "newEmail", "token", "expiresAt", "userId", "createdAt" FROM "temporary_email_change_tokens"`);
        await queryRunner.query(`DROP TABLE "temporary_email_change_tokens"`);
        await queryRunner.query(`DROP TABLE "email_change_tokens"`);
    }

}
