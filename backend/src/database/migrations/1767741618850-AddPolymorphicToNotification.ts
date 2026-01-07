import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPolymorphicToNotification1767741618850 implements MigrationInterface {
    name = 'AddPolymorphicToNotification1767741618850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar NOT NULL, "read" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceType" varchar CHECK( "resourceType" IN ('Post','Comment','CommunityMembershipRequest') ), "resourceId" integer, "recipientId" integer, "actorId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_notifications" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar NOT NULL, "read" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceType" varchar CHECK( "resourceType" IN ('Post','Comment','CommunityMembershipRequest') ), "resourceId" integer, "recipientId" integer, "actorId" integer, CONSTRAINT "FK_db873ba9a123711a4bff527ccd5" FOREIGN KEY ("recipientId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_44412a2d6f162ff4dc1697d0db7" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_notifications"("id", "type", "read", "createdAt", "resourceType", "resourceId", "recipientId", "actorId") SELECT "id", "type", "read", "createdAt", "resourceType", "resourceId", "recipientId", "actorId" FROM "notifications"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`ALTER TABLE "temporary_notifications" RENAME TO "notifications"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" RENAME TO "temporary_notifications"`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar NOT NULL, "read" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceType" varchar CHECK( "resourceType" IN ('Post','Comment','CommunityMembershipRequest') ), "resourceId" integer, "recipientId" integer, "actorId" integer)`);
        await queryRunner.query(`INSERT INTO "notifications"("id", "type", "read", "createdAt", "resourceType", "resourceId", "recipientId", "actorId") SELECT "id", "type", "read", "createdAt", "resourceType", "resourceId", "recipientId", "actorId" FROM "temporary_notifications"`);
        await queryRunner.query(`DROP TABLE "temporary_notifications"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
