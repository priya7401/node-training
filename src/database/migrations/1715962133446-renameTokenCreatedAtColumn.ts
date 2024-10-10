import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTokenCreatedAtColumn1715962133446 implements MigrationInterface {
    name = 'RenameTokenCreatedAtColumn1715962133446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "token_created_at" TO "token_invalidate_before"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "token_invalidate_before" TO "token_created_at"`);
    }

}
