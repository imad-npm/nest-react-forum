import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwnerRoleToMemeberships1766756846428 implements MigrationInterface {
    name = 'AddOwnerRoleToMemeberships1766756846428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_community_memberships" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "role" varchar CHECK( "role" IN ('createdBy','admin','moderator','member') ) NOT NULL DEFAULT ('member'), CONSTRAINT "FK_6ea82875cc58f4b1b14ebe49717" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_488d1ca96e355e11d83480a8f2c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_community_memberships"("userId", "communityId", "createdAt", "role") SELECT "userId", "communityId", "createdAt", "role" FROM "community_memberships"`);
        await queryRunner.query(`DROP TABLE "community_memberships"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_memberships" RENAME TO "community_memberships"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_memberships" RENAME TO "temporary_community_memberships"`);
        await queryRunner.query(`CREATE TABLE "community_memberships" ("userId" integer NOT NULL, "communityId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "role" varchar CHECK( "role" IN ('admin','moderator','member') ) NOT NULL DEFAULT ('member'), CONSTRAINT "FK_6ea82875cc58f4b1b14ebe49717" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_488d1ca96e355e11d83480a8f2c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "community_memberships"("userId", "communityId", "createdAt", "role") SELECT "userId", "communityId", "createdAt", "role" FROM "temporary_community_memberships"`);
        await queryRunner.query(`DROP TABLE "temporary_community_memberships"`);
    }

}
