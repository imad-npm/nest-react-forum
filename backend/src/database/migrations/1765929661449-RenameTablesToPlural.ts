import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTablesToPlural1765929661449 implements MigrationInterface {
    name = 'RenameTablesToPlural1765929661449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_d7d9db2320c356f8d32eae9d752" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_reactions"("id", "type", "postId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "postId", "userId", "createdAt", "updatedAt" FROM "post_reactions"`);
        await queryRunner.query(`DROP TABLE "post_reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_reactions" RENAME TO "post_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_b9fbc058a6dd52aec6c76f9b58a" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment_reactions"("id", "type", "commentId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "commentId", "userId", "createdAt", "updatedAt" FROM "comment_reactions"`);
        await queryRunner.query(`DROP TABLE "comment_reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment_reactions" RENAME TO "comment_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
        await queryRunner.query(`CREATE TABLE "comments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "postId" integer, "parentId" integer)`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "communityId" integer, "commentsCount" integer NOT NULL DEFAULT (0), "views" integer NOT NULL DEFAULT (0), "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_d7d9db2320c356f8d32eae9d752" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_b8f6756d160de241ea96a768254" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_reactions"("id", "type", "postId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "postId", "userId", "createdAt", "updatedAt" FROM "post_reactions"`);
        await queryRunner.query(`DROP TABLE "post_reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_reactions" RENAME TO "post_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_b9fbc058a6dd52aec6c76f9b58a" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ab02238d3deb62cba37aa8047dd" FOREIGN KEY ("commentId") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment_reactions"("id", "type", "commentId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "commentId", "userId", "createdAt", "updatedAt" FROM "comment_reactions"`);
        await queryRunner.query(`DROP TABLE "comment_reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment_reactions" RENAME TO "comment_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
        await queryRunner.query(`CREATE TABLE "temporary_comments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "postId" integer, "parentId" integer, CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81" FOREIGN KEY ("parentId") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comments"("id", "content", "authorId", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "postId", "parentId") SELECT "id", "content", "authorId", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "postId", "parentId" FROM "comments"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`ALTER TABLE "temporary_comments" RENAME TO "comments"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "communityId" integer, "commentsCount" integer NOT NULL DEFAULT (0), "views" integer NOT NULL DEFAULT (0), "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_e5f99a0b3edb7e1867f44b2cf4c" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt") SELECT "id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "communityId" integer, "commentsCount" integer NOT NULL DEFAULT (0), "views" integer NOT NULL DEFAULT (0), "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt") SELECT "id", "title", "content", "authorId", "communityId", "commentsCount", "views", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`ALTER TABLE "comments" RENAME TO "temporary_comments"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "likesCount" integer NOT NULL DEFAULT (0), "dislikesCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "postId" integer, "parentId" integer)`);
        await queryRunner.query(`INSERT INTO "comments"("id", "content", "authorId", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "postId", "parentId") SELECT "id", "content", "authorId", "likesCount", "dislikesCount", "createdAt", "updatedAt", "deletedAt", "postId", "parentId" FROM "temporary_comments"`);
        await queryRunner.query(`DROP TABLE "temporary_comments"`);
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`ALTER TABLE "comment_reactions" RENAME TO "temporary_comment_reactions"`);
        await queryRunner.query(`CREATE TABLE "comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_b9fbc058a6dd52aec6c76f9b58a" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "comment_reactions"("id", "type", "commentId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "commentId", "userId", "createdAt", "updatedAt" FROM "temporary_comment_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_comment_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`ALTER TABLE "post_reactions" RENAME TO "temporary_post_reactions"`);
        await queryRunner.query(`CREATE TABLE "post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_d7d9db2320c356f8d32eae9d752" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "post_reactions"("id", "type", "postId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "postId", "userId", "createdAt", "updatedAt" FROM "temporary_post_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_post_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`ALTER TABLE "comment_reactions" RENAME TO "temporary_comment_reactions"`);
        await queryRunner.query(`CREATE TABLE "comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_b9fbc058a6dd52aec6c76f9b58a" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ab02238d3deb62cba37aa8047dd" FOREIGN KEY ("commentId") REFERENCES "comment" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "comment_reactions"("id", "type", "commentId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "commentId", "userId", "createdAt", "updatedAt" FROM "temporary_comment_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_comment_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`ALTER TABLE "post_reactions" RENAME TO "temporary_post_reactions"`);
        await queryRunner.query(`CREATE TABLE "post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_d7d9db2320c356f8d32eae9d752" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_b8f6756d160de241ea96a768254" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "post_reactions"("id", "type", "postId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "postId", "userId", "createdAt", "updatedAt" FROM "temporary_post_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_post_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
    }

}
