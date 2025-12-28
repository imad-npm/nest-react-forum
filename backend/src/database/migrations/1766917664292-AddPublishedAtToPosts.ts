import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishedAtToPosts1766917664292 implements MigrationInterface {
    name = 'AddPublishedAtToPosts1766917664292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "communityId" integer NOT NULL, "commentsCount" integer NOT NULL DEFAULT (0), "views" integer NOT NULL DEFAULT (0), "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "commentsLocked" boolean NOT NULL DEFAULT (0), "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), "publishedAt" datetime, CONSTRAINT "FK_e5f99a0b3edb7e1867f44b2cf4c" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "commentsLocked", "status") SELECT "id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "commentsLocked", "status" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "communityId" integer NOT NULL, "commentsCount" integer NOT NULL DEFAULT (0), "views" integer NOT NULL DEFAULT (0), "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "commentsLocked" boolean NOT NULL DEFAULT (0), "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), CONSTRAINT "FK_e5f99a0b3edb7e1867f44b2cf4c" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "commentsLocked", "status") SELECT "id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "commentsLocked", "status" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
    }

}
