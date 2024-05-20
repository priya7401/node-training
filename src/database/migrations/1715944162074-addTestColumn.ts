import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTestColumn1715944162074 implements MigrationInterface {
    name = 'AddTestColumn1715944162074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "test_column" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "test_column"`);
    }

}
