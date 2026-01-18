import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSavedPosts1768734302745 implements MigrationInterface {
    name = 'AddSavedPosts1768734302745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt" FROM "community_restrictions"`);
        await queryRunner.query(`DROP TABLE "community_restrictions"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_restrictions" RENAME TO "community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "saved_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "savedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_4d3790479b4ace0798f7d54c551" UNIQUE ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer NOT NULL, "userId" integer NOT NULL, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt" FROM "community_restrictions"`);
        await queryRunner.query(`DROP TABLE "community_restrictions"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_restrictions" RENAME TO "community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer NOT NULL, "userId" integer NOT NULL, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_066c4afe6f1ba3f2178159967cc" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_7399cce662943e126a61f635e5c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt" FROM "community_restrictions"`);
        await queryRunner.query(`DROP TABLE "community_restrictions"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_restrictions" RENAME TO "community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "temporary_saved_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "savedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_4d3790479b4ace0798f7d54c551" UNIQUE ("userId", "postId"), CONSTRAINT "FK_2a6ac38aa1767f692d4f492639b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_4704fa96cd2b591592a8cfaee56" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_saved_posts"("id", "userId", "postId", "savedAt") SELECT "id", "userId", "postId", "savedAt" FROM "saved_posts"`);
        await queryRunner.query(`DROP TABLE "saved_posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_saved_posts" RENAME TO "saved_posts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_posts" RENAME TO "temporary_saved_posts"`);
        await queryRunner.query(`CREATE TABLE "saved_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "savedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_4d3790479b4ace0798f7d54c551" UNIQUE ("userId", "postId"))`);
        await queryRunner.query(`INSERT INTO "saved_posts"("id", "userId", "postId", "savedAt") SELECT "id", "userId", "postId", "savedAt" FROM "temporary_saved_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_saved_posts"`);
        await queryRunner.query(`ALTER TABLE "community_restrictions" RENAME TO "temporary_community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer NOT NULL, "userId" integer NOT NULL, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt" FROM "temporary_community_restrictions"`);
        await queryRunner.query(`DROP TABLE "temporary_community_restrictions"`);
        await queryRunner.query(`ALTER TABLE "community_restrictions" RENAME TO "temporary_community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt" FROM "temporary_community_restrictions"`);
        await queryRunner.query(`DROP TABLE "temporary_community_restrictions"`);
        await queryRunner.query(`DROP TABLE "saved_posts"`);
        await queryRunner.query(`ALTER TABLE "community_restrictions" RENAME TO "temporary_community_restrictions"`);
        await queryRunner.query(`CREATE TABLE "community_restrictions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restrictionType" varchar CHECK( "restrictionType" IN ('ban','mute') ) NOT NULL, "createdById" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityId" integer, "userId" integer, "reason" text, "expiresAt" datetime, CONSTRAINT "FK_066c4afe6f1ba3f2178159967cc" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7399cce662943e126a61f635e5c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6b3370beb21ea2316b1e3c444ad" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "community_restrictions"("id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt") SELECT "id", "restrictionType", "createdById", "createdAt", "communityId", "userId", "reason", "expiresAt" FROM "temporary_community_restrictions"`);
        await queryRunner.query(`DROP TABLE "temporary_community_restrictions"`);
    }

}
