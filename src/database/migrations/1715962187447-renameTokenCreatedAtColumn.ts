import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTokenCreatedAtColumn1715962187447 implements MigrationInterface {
    name = 'RenameTokenCreatedAtColumn1715962187447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "token_invalidate_before" TO "invalidate_token_before"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "invalidate_token_before" TO "token_invalidate_before"`);
    }

}
