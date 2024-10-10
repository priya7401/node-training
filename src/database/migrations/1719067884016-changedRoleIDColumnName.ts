import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedRoleIDColumnName1719067884016 implements MigrationInterface {
    name = 'ChangedRoleIDColumnName1719067884016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "roleId" TO "role_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role_id" TO "roleId"`);
    }

}
