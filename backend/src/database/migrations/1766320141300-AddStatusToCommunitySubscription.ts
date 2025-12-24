import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToCommunitySubscription1766320141300 implements MigrationInterface {
    name = 'AddStatusToCommunitySubscription1766320141300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_community_memberships" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "status" varchar CHECK( "status" IN ('active','pending','blocked') ) NOT NULL DEFAULT ('pending'), CONSTRAINT "FK_bcf2842e0032d27fb9d1c830e09" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a0761971a3fcd032c682d45f8a6" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_community_memberships"("userId", "communityId", "createdAt") SELECT "userId", "communityId", "createdAt" FROM "community_memberships"`);
        await queryRunner.query(`DROP TABLE "community_memberships"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_memberships" RENAME TO "community_memberships"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_memberships" RENAME TO "temporary_community_memberships"`);
        await queryRunner.query(`CREATE TABLE "community_memberships" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_bcf2842e0032d27fb9d1c830e09" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a0761971a3fcd032c682d45f8a6" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "community_memberships"("userId", "communityId", "createdAt") SELECT "userId", "communityId", "createdAt" FROM "temporary_community_memberships"`);
        await queryRunner.query(`DROP TABLE "temporary_community_memberships"`);
    }

}
