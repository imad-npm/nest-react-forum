import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifrokesTable1765214825123 implements MigrationInterface {
    name = 'AddVerifrokesTable1765214825123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verification_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "userId" integer NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_3d1613f95c6a564a3b588d161ae" UNIQUE ("token"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
    }

}
