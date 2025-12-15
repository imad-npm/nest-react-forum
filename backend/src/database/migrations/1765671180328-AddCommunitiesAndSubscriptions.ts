import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommunitiesAndSubscriptions1765671180328 implements MigrationInterface {
    name = 'AddCommunitiesAndSubscriptions1765671180328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "community_subscriptions" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "createdById" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isPublic" boolean NOT NULL DEFAULT (1), "subscribersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "communityId" integer, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt") SELECT "id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_subscriptions" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_a0761971a3fcd032c682d45f8a6" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bcf2842e0032d27fb9d1c830e09" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_community_subscriptions"("userId", "communityId", "createdAt") SELECT "userId", "communityId", "createdAt" FROM "community_subscriptions"`);
        await queryRunner.query(`DROP TABLE "community_subscriptions"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_subscriptions" RENAME TO "community_subscriptions"`);
        await queryRunner.query(`CREATE TABLE "temporary_communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "createdById" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isPublic" boolean NOT NULL DEFAULT (1), "subscribersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"), CONSTRAINT "FK_d035f75868bd42e56593ffa4aa7" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_communities"("id", "name", "displayName", "description", "createdById", "createdAt", "isPublic", "subscribersCount") SELECT "id", "name", "displayName", "description", "createdById", "createdAt", "isPublic", "subscribersCount" FROM "communities"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`ALTER TABLE "temporary_communities" RENAME TO "communities"`);
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "communityId" integer, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eff802f635e95c8aef1998b4843" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId") SELECT "id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "communityId" integer, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "post"("id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId") SELECT "id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
        await queryRunner.query(`ALTER TABLE "communities" RENAME TO "temporary_communities"`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "createdById" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isPublic" boolean NOT NULL DEFAULT (1), "subscribersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "communities"("id", "name", "displayName", "description", "createdById", "createdAt", "isPublic", "subscribersCount") SELECT "id", "name", "displayName", "description", "createdById", "createdAt", "isPublic", "subscribersCount" FROM "temporary_communities"`);
        await queryRunner.query(`DROP TABLE "temporary_communities"`);
        await queryRunner.query(`ALTER TABLE "community_subscriptions" RENAME TO "temporary_community_subscriptions"`);
        await queryRunner.query(`CREATE TABLE "community_subscriptions" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "community_subscriptions"("userId", "communityId", "createdAt") SELECT "userId", "communityId", "createdAt" FROM "temporary_community_subscriptions"`);
        await queryRunner.query(`DROP TABLE "temporary_community_subscriptions"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "post"("id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt") SELECT "id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`DROP TABLE "community_subscriptions"`);
    }

}
