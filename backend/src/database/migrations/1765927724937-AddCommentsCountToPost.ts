import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsCountToPost1765927724937 implements MigrationInterface {
    name = 'AddCommentsCountToPost1765927724937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "communityId" integer, "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "commentsCount" integer NOT NULL DEFAULT (0), CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eff802f635e95c8aef1998b4843" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId", "likesCount", "dislikesCount") SELECT "id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId", "likesCount", "dislikesCount" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "communityId" integer, "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eff802f635e95c8aef1998b4843" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "post"("id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId", "likesCount", "dislikesCount") SELECT "id", "title", "content", "authorId", "views", "createdAt", "updatedAt", "deletedAt", "communityId", "likesCount", "dislikesCount" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
    }

}
