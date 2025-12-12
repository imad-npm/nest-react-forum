import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReactions1764783033004 implements MigrationInterface {
  name = 'AddReactions1764783033004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "commentId" integer, "userId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "authorId" integer NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "parentId" integer, CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_comment"("id", "content", "createdAt", "postId", "authorId") SELECT "id", "content", "createdAt", "postId", "authorId" FROM "comment"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_comment" RENAME TO "comment"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, "views" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_post"("id", "title", "content", "authorId") SELECT "id", "title", "content", "authorId" FROM "post"`,
    );
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_reaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "commentId" integer, "userId" integer NOT NULL, CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4584f851fc6471f517d9dad8966" FOREIGN KEY ("commentId") REFERENCES "comment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_reaction"("id", "type", "createdAt", "updatedAt", "postId", "commentId", "userId") SELECT "id", "type", "createdAt", "updatedAt", "postId", "commentId", "userId" FROM "reaction"`,
    );
    await queryRunner.query(`DROP TABLE "reaction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_reaction" RENAME TO "reaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "authorId" integer NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "parentId" integer, CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_comment"("id", "content", "createdAt", "postId", "authorId", "updatedAt", "deletedAt", "parentId") SELECT "id", "content", "createdAt", "postId", "authorId", "updatedAt", "deletedAt", "parentId" FROM "comment"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_comment" RENAME TO "comment"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" RENAME TO "temporary_comment"`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "authorId" integer NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "parentId" integer, CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "comment"("id", "content", "createdAt", "postId", "authorId", "updatedAt", "deletedAt", "parentId") SELECT "id", "content", "createdAt", "postId", "authorId", "updatedAt", "deletedAt", "parentId" FROM "temporary_comment"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_comment"`);
    await queryRunner.query(
      `ALTER TABLE "reaction" RENAME TO "temporary_reaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "reaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar CHECK( "type" IN ('like','dislike') ) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "commentId" integer, "userId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "reaction"("id", "type", "createdAt", "updatedAt", "postId", "commentId", "userId") SELECT "id", "type", "createdAt", "updatedAt", "postId", "commentId", "userId" FROM "temporary_reaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_reaction"`);
    await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
    await queryRunner.query(
      `CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "post"("id", "title", "content", "authorId") SELECT "id", "title", "content", "authorId" FROM "temporary_post"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_post"`);
    await queryRunner.query(
      `ALTER TABLE "comment" RENAME TO "temporary_comment"`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, "authorId" integer NOT NULL, CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "comment"("id", "content", "createdAt", "postId", "authorId") SELECT "id", "content", "createdAt", "postId", "authorId" FROM "temporary_comment"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_comment"`);
    await queryRunner.query(`DROP TABLE "reaction"`);
  }
}
