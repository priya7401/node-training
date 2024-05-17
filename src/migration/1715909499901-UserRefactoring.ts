import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRefactoring1715909499901 implements MigrationInterface {
    name = 'UserRefactoring1715909499901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "token_created_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token_created_at"`);
    }

}
