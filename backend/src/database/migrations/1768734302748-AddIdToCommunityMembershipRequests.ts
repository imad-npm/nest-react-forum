import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdToCommunityMembershipRequests1768734302748 implements MigrationInterface {
    name = 'AddIdToCommunityMembershipRequests1768734302748'
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Rename old table
        await queryRunner.query(`ALTER TABLE community_membership_requests RENAME TO tmp_community_membership_requests`);

        // 2. Create new table with id as PRIMARY KEY and unique constraint on userId + communityId
        await queryRunner.query(`
            CREATE TABLE community_membership_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                communityId INTEGER NOT NULL,
                status VARCHAR(255) DEFAULT 'pending',
                createdAt DATETIME DEFAULT (datetime('now')),
                UNIQUE(userId, communityId),
                FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(communityId) REFERENCES communities(id) ON DELETE CASCADE
            )
        `);

        // 3. Copy old data into new table
        await queryRunner.query(`
            INSERT INTO community_membership_requests (userId, communityId, status, createdAt)
            SELECT userId, communityId, status, createdAt
            FROM tmp_community_membership_requests
        `);

        // 4. Drop old table
        await queryRunner.query(`DROP TABLE tmp_community_membership_requests`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert: recreate old table with composite PK
        await queryRunner.query(`ALTER TABLE community_membership_requests RENAME TO tmp_community_membership_requests`);

        await queryRunner.query(`
            CREATE TABLE community_membership_requests (
                userId INTEGER NOT NULL,
                communityId INTEGER NOT NULL,
                status VARCHAR(255) DEFAULT 'pending',
                createdAt DATETIME DEFAULT (datetime('now')),
                PRIMARY KEY(userId, communityId),
                FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(communityId) REFERENCES communities(id) ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            INSERT INTO community_membership_requests (userId, communityId, status, createdAt)
            SELECT userId, communityId, status, createdAt
            FROM tmp_community_membership_requests
        `);

        await queryRunner.query(`DROP TABLE tmp_community_membership_requests`);
    }
}
