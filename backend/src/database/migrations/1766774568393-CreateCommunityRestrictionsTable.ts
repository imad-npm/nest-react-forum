import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommunityRestrictionsTable1766774568393 implements MigrationInterface {
    name = 'CreateCommunityRestrictionsTable1766774568393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer)`);
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
        await queryRunner.query(`CREATE TABLE "temporary_community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer, CONSTRAINT "FK_066c4afe6f1ba3f2178159967cc" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7399cce662943e126a61f635e5c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_restrictions"("id", "restrictionType", "createdAt", "communityId", "userId") SELECT "id", "restrictionType", "createdAt", "communityId", "userId" FROM "community_restrictions"`);
        await queryRunner.query(`DROP TABLE "community_restrictions"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_restrictions" RENAME TO "community_restrictions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_restrictions" RENAME TO "temporary_community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "community_restrictions"("id", "restrictionType", "createdAt", "communityId", "userId") SELECT "id", "restrictionType", "createdAt", "communityId", "userId" FROM "temporary_community_restrictions"`);
        await queryRunner.query(`DROP TABLE "temporary_community_restrictions"`);
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
        await queryRunner.query(`DROP TABLE "community_restrictions"`);
    }

}
