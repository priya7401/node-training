import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueConstraintForPermissions1719115656712 implements MigrationInterface {
    name = 'AddedUniqueConstraintForPermissions1719115656712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_bdf3545f3b5b63cede281149fc1" UNIQUE ("roleId", "module_name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_bdf3545f3b5b63cede281149fc1"`);
    }

}
