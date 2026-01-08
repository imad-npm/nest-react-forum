import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameOwnerIdToCreatedByIdInCommunities1767868388303 implements MigrationInterface {
    name = 'RenameOwnerIdToCreatedByIdInCommunities1767868388303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "ownerId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityType" varchar CHECK( "communityType" IN ('public','restricted','private') ) NOT NULL DEFAULT ('public'), "membersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_communities"("id", "name", "displayName", "description", "ownerId", "createdAt", "communityType", "membersCount") SELECT "id", "name", "displayName", "description", "ownerId", "createdAt", "communityType", "membersCount" FROM "communities"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`ALTER TABLE "temporary_communities" RENAME TO "communities"`);
        await queryRunner.query(`CREATE TABLE "temporary_communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "createdById" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityType" varchar CHECK( "communityType" IN ('public','restricted','private') ) NOT NULL DEFAULT ('public'), "membersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_communities"("id", "name", "displayName", "description", "createdById", "createdAt", "communityType", "membersCount") SELECT "id", "name", "displayName", "description", "ownerId", "createdAt", "communityType", "membersCount" FROM "communities"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`ALTER TABLE "temporary_communities" RENAME TO "communities"`);
        await queryRunner.query(`CREATE TABLE "temporary_communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "createdById" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityType" varchar CHECK( "communityType" IN ('public','restricted','private') ) NOT NULL DEFAULT ('public'), "membersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"), CONSTRAINT "FK_d035f75868bd42e56593ffa4aa7" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_communities"("id", "name", "displayName", "description", "createdById", "createdAt", "communityType", "membersCount") SELECT "id", "name", "displayName", "description", "createdById", "createdAt", "communityType", "membersCount" FROM "communities"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`ALTER TABLE "temporary_communities" RENAME TO "communities"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communities" RENAME TO "temporary_communities"`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "createdById" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityType" varchar CHECK( "communityType" IN ('public','restricted','private') ) NOT NULL DEFAULT ('public'), "membersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "communities"("id", "name", "displayName", "description", "createdById", "createdAt", "communityType", "membersCount") SELECT "id", "name", "displayName", "description", "createdById", "createdAt", "communityType", "membersCount" FROM "temporary_communities"`);
        await queryRunner.query(`DROP TABLE "temporary_communities"`);
        await queryRunner.query(`ALTER TABLE "communities" RENAME TO "temporary_communities"`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "ownerId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityType" varchar CHECK( "communityType" IN ('public','restricted','private') ) NOT NULL DEFAULT ('public'), "membersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "communities"("id", "name", "displayName", "description", "ownerId", "createdAt", "communityType", "membersCount") SELECT "id", "name", "displayName", "description", "createdById", "createdAt", "communityType", "membersCount" FROM "temporary_communities"`);
        await queryRunner.query(`DROP TABLE "temporary_communities"`);
        await queryRunner.query(`ALTER TABLE "communities" RENAME TO "temporary_communities"`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "displayName" varchar(100), "description" text, "ownerId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "communityType" varchar CHECK( "communityType" IN ('public','restricted','private') ) NOT NULL DEFAULT ('public'), "membersCount" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_501bb6c8f7c8e8a7d614d9435f6" UNIQUE ("name"), CONSTRAINT "FK_2d9086cef1ffd5148f90a9fab5d" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "communities"("id", "name", "displayName", "description", "ownerId", "createdAt", "communityType", "membersCount") SELECT "id", "name", "displayName", "description", "ownerId", "createdAt", "communityType", "membersCount" FROM "temporary_communities"`);
        await queryRunner.query(`DROP TABLE "temporary_communities"`);
    }

}
