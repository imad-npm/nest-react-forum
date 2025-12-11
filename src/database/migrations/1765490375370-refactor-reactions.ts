import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorReactions1765490375370 implements MigrationInterface {
    name = 'RefactorReactions1765490375370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
        await queryRunner.query(`CREATE TABLE "comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_b8f6756d160de241ea96a768254" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d7d9db2320c356f8d32eae9d752" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_reactions"("id", "type", "postId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "postId", "userId", "createdAt", "updatedAt" FROM "post_reactions"`);
        await queryRunner.query(`DROP TABLE "post_reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_reactions" RENAME TO "post_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_ab02238d3deb62cba37aa8047dd" FOREIGN KEY ("commentId") REFERENCES "comment" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_b9fbc058a6dd52aec6c76f9b58a" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment_reactions"("id", "type", "commentId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "commentId", "userId", "createdAt", "updatedAt" FROM "comment_reactions"`);
        await queryRunner.query(`DROP TABLE "comment_reactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment_reactions" RENAME TO "comment_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`ALTER TABLE "comment_reactions" RENAME TO "temporary_comment_reactions"`);
        await queryRunner.query(`CREATE TABLE "comment_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "commentId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "comment_reactions"("id", "type", "commentId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "commentId", "userId", "createdAt", "updatedAt" FROM "temporary_comment_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_comment_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f7d4bdbc66f63d75b26740a4a" ON "comment_reactions" ("commentId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`ALTER TABLE "post_reactions" RENAME TO "temporary_post_reactions"`);
        await queryRunner.query(`CREATE TABLE "post_reactions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "post_reactions"("id", "type", "postId", "userId", "createdAt", "updatedAt") SELECT "id", "type", "postId", "userId", "createdAt", "updatedAt" FROM "temporary_post_reactions"`);
        await queryRunner.query(`DROP TABLE "temporary_post_reactions"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_452ad3c5abe99f67a3b482f65e" ON "post_reactions" ("postId", "userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4f7d4bdbc66f63d75b26740a4a"`);
        await queryRunner.query(`DROP TABLE "comment_reactions"`);
        await queryRunner.query(`DROP INDEX "IDX_452ad3c5abe99f67a3b482f65e"`);
        await queryRunner.query(`DROP TABLE "post_reactions"`);
    }

}
