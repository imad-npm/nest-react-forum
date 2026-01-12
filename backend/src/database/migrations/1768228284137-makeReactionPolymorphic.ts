import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeReactionPolymorphic1768228284137 implements MigrationInterface {
    name = 'MakeReactionPolymorphic1768228284137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "reactableId" integer NOT NULL, "reactableType" varchar NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4575452e465a521fb4d2e042b2" ON "reactions" ("reactableId", "reactableType", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4575452e465a521fb4d2e042b2"`);
        await queryRunner.query(`CREATE TABLE "temporary_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "reactableId" integer NOT NULL, "reactableType" varchar NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f3e1d278edeb2c19a2ddad83f8e" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reactions"("id", "type", "reactableId", "reactableType", "userId", "createdAt", "updatedAt") SELECT "id", "type", "reactableId", "reactableType", "userId", "createdAt", "updatedAt" FROM "reactions"`);
        await queryRunner.query(`DROP TABLE "reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_reactions" RENAME TO "reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4575452e465a521fb4d2e042b2" ON "reactions" ("reactableId", "reactableType", "userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4575452e465a521fb4d2e042b2"`);
        await queryRunner.query(`ALTER TABLE "reactions" RENAME TO "temporary_reactions"`);
        await queryRunner.query(`CREATE TABLE "reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "reactableId" integer NOT NULL, "reactableType" varchar NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "reactions"("id", "type", "reactableId", "reactableType", "userId", "createdAt", "updatedAt") SELECT "id", "type", "reactableId", "reactableType", "userId", "createdAt", "updatedAt" FROM "temporary_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4575452e465a521fb4d2e042b2" ON "reactions" ("reactableId", "reactableType", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4575452e465a521fb4d2e042b2"`);
        await queryRunner.query(`DROP TABLE "reactions"`);
    }

}
