import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedColumnNamesForForeignKeys1719158841221 implements MigrationInterface {
    name = 'AddedColumnNamesForForeignKeys1719158841221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_bdf3545f3b5b63cede281149fc1"`);
        await queryRunner.query(`ALTER TABLE "permissions" RENAME COLUMN "roleId" TO "role_id"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "REL_438888108e79d97811eefe304f"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP COLUMN "attachmentId"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD "project_id" integer`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD "attachment_id" integer`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "UQ_1e755fb746c77971a03c84e92cc" UNIQUE ("attachment_id")`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_422378c596291a0fed35e2489c1" UNIQUE ("role_id", "module_name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_422378c596291a0fed35e2489c1"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "UQ_1e755fb746c77971a03c84e92cc"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP COLUMN "attachment_id"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD "attachmentId" integer`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "REL_438888108e79d97811eefe304f" UNIQUE ("attachmentId")`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "permissions" RENAME COLUMN "role_id" TO "roleId"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_bdf3545f3b5b63cede281149fc1" UNIQUE ("module_name", "roleId")`);
    }

}
