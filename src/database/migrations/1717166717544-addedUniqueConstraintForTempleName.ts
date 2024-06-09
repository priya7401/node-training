import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueConstraintForTempleName1717166717544 implements MigrationInterface {
    name = 'AddedUniqueConstraintForTempleName1717166717544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_01e86414ef1aa33583807d18222" UNIQUE ("temple_name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_01e86414ef1aa33583807d18222"`);
    }

}
