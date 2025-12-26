import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIdFromMembRequests1766761884496 implements MigrationInterface {
    name = 'RemoveIdFromMembRequests1766761884496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c2cdfa8ac8820dca58f4a706773" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f41b77e974eb717317d0b8d6469" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_membership_requests" RENAME TO "community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_membership_requests" RENAME TO "community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_membership_requests" RENAME TO "community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f41b77e974eb717317d0b8d6469" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c2cdfa8ac8820dca58f4a706773" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_membership_requests" RENAME TO "community_membership_requests"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_membership_requests" RENAME TO "temporary_community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "temporary_community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "temporary_community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "community_membership_requests" RENAME TO "temporary_community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "temporary_community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "temporary_community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "community_membership_requests" RENAME TO "temporary_community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "community_membership_requests" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f41b77e974eb717317d0b8d6469" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "temporary_community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "temporary_community_membership_requests"`);
        await queryRunner.query(`ALTER TABLE "community_membership_requests" RENAME TO "temporary_community_membership_requests"`);
        await queryRunner.query(`CREATE TABLE "community_membership_requests" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "communityId" integer NOT NULL, "status" varchar CHECK( "status" IN ('pending','accepted','rejected') ) NOT NULL DEFAULT ('pending'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c2cdfa8ac8820dca58f4a706773" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f41b77e974eb717317d0b8d6469" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "community_membership_requests"("userId", "communityId", "status", "createdAt") SELECT "userId", "communityId", "status", "createdAt" FROM "temporary_community_membership_requests"`);
        await queryRunner.query(`DROP TABLE "temporary_community_membership_requests"`);
    }

}
