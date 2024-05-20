import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTestColumn1715950619811 implements MigrationInterface {
    name = 'RemoveTestColumn1715950619811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "test_column"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "test_column" character varying`);
    }

}
