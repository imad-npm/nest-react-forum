import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToReport1768312801963 implements MigrationInterface {
    name = 'AddUpdatedAtToReport1768312801963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add updatedAt column with default to current timestamp
        await queryRunner.query(`
            ALTER TABLE "reports"
            ADD COLUMN "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the column on rollback
        await queryRunner.query(`
            ALTER TABLE "reports"
            DROP COLUMN "updatedAt"
        `);
    }
}
