import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenCreatedColumn1715943196635 implements MigrationInterface {
    name = 'AddTokenCreatedColumn1715943196635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "token_created_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token_created_at"`);
    }

}
