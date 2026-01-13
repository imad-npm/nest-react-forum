import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeReportPolymorphic1768312680739 implements MigrationInterface {
    name = 'MakeReportPolymorphic1768312680739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reports" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "reporterId" integer NOT NULL, "reportableType" varchar CHECK( "reportableType" IN ('post','comment','user') ) NOT NULL, "reportableId" integer NOT NULL, "communityId" integer, "status" varchar CHECK( "status" IN ('pending','resolved','dismissed') ) NOT NULL DEFAULT ('pending'), "isPlatformComplaint" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_f27cff4de5f4850caa6666c81c" ON "reports" ("reportableType", "reportableId") `);
        await queryRunner.query(`DROP INDEX "IDX_f27cff4de5f4850caa6666c81c"`);
        await queryRunner.query(`CREATE TABLE "temporary_reports" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "reporterId" integer NOT NULL, "reportableType" varchar CHECK( "reportableType" IN ('post','comment','user') ) NOT NULL, "reportableId" integer NOT NULL, "communityId" integer, "status" varchar CHECK( "status" IN ('pending','resolved','dismissed') ) NOT NULL DEFAULT ('pending'), "isPlatformComplaint" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_4353be8309ce86650def2f8572d" FOREIGN KEY ("reporterId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reports"("id", "reporterId", "reportableType", "reportableId", "communityId", "status", "isPlatformComplaint", "createdAt") SELECT "id", "reporterId", "reportableType", "reportableId", "communityId", "status", "isPlatformComplaint", "createdAt" FROM "reports"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`ALTER TABLE "temporary_reports" RENAME TO "reports"`);
        await queryRunner.query(`CREATE INDEX "IDX_f27cff4de5f4850caa6666c81c" ON "reports" ("reportableType", "reportableId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_f27cff4de5f4850caa6666c81c"`);
        await queryRunner.query(`ALTER TABLE "reports" RENAME TO "temporary_reports"`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "reporterId" integer NOT NULL, "reportableType" varchar CHECK( "reportableType" IN ('post','comment','user') ) NOT NULL, "reportableId" integer NOT NULL, "communityId" integer, "status" varchar CHECK( "status" IN ('pending','resolved','dismissed') ) NOT NULL DEFAULT ('pending'), "isPlatformComplaint" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "reports"("id", "reporterId", "reportableType", "reportableId", "communityId", "status", "isPlatformComplaint", "createdAt") SELECT "id", "reporterId", "reportableType", "reportableId", "communityId", "status", "isPlatformComplaint", "createdAt" FROM "temporary_reports"`);
        await queryRunner.query(`DROP TABLE "temporary_reports"`);
        await queryRunner.query(`CREATE INDEX "IDX_f27cff4de5f4850caa6666c81c" ON "reports" ("reportableType", "reportableId") `);
        await queryRunner.query(`DROP INDEX "IDX_f27cff4de5f4850caa6666c81c"`);
        await queryRunner.query(`DROP TABLE "reports"`);
    }

}
