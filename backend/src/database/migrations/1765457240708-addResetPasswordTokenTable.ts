import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResetPasswordTokenTable1765457240708 implements MigrationInterface {
  name = 'AddResetPasswordTokenTable1765457240708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "password_reset_tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "token" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d6a19d4b4f6c62dcd29daa497e" ON "password_reset_tokens" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab673f0e63eac966762155508e" ON "password_reset_tokens" ("token") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ab673f0e63eac966762155508e"`);
    await queryRunner.query(`DROP INDEX "IDX_d6a19d4b4f6c62dcd29daa497e"`);
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
  }
}
