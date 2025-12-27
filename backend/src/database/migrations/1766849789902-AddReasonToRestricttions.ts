import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReasonToRestricttions1766849789902 implements MigrationInterface {
    name = 'AddReasonToRestricttions1766849789902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7399cce662943e126a61f635e5c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_066c4afe6f1ba3f2178159967cc" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId" FROM "community_restrictions"`);
        await queryRunner.query(`DROP TABLE "community_restrictions"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_restrictions" RENAME TO "community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_memberships" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "role" varchar CHECK( "role" IN ('moderator','member') ) NOT NULL DEFAULT ('member'), "rank" integer, CONSTRAINT "FK_6ea82875cc58f4b1b14ebe49717" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_488d1ca96e355e11d83480a8f2c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_community_memberships"("userId", "communityId", "createdAt", "role", "rank") SELECT "userId", "communityId", "createdAt", "role", "rank" FROM "community_memberships"`);
        await queryRunner.query(`DROP TABLE "community_memberships"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_memberships" RENAME TO "community_memberships"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_memberships" RENAME TO "temporary_community_memberships"`);
        await queryRunner.query(`CREATE TABLE "community_memberships" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "role" varchar CHECK( "role" IN ('owner','admin','moderator','member') ) NOT NULL DEFAULT ('member'), "rank" integer, CONSTRAINT "FK_6ea82875cc58f4b1b14ebe49717" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_488d1ca96e355e11d83480a8f2c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "community_memberships"("userId", "communityId", "createdAt", "role", "rank") SELECT "userId", "communityId", "createdAt", "role", "rank" FROM "temporary_community_memberships"`);
        await queryRunner.query(`DROP TABLE "temporary_community_memberships"`);
        await queryRunner.query(`ALTER TABLE "community_restrictions" RENAME TO "temporary_community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7399cce662943e126a61f635e5c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_066c4afe6f1ba3f2178159967cc" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId" FROM "temporary_community_restrictions"`);
        await queryRunner.query(`DROP TABLE "temporary_community_restrictions"`);
    }

}
