import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedForeignKeyName1717167491896 implements MigrationInterface {
    name = 'AddedForeignKeyName1717167491896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "FK_e55cc4bc84ecd45b89a33d7db26"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "FK_438888108e79d97811eefe304f5"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "project_id" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "attachment_id" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "attachment_id"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "project_id"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "FK_438888108e79d97811eefe304f5" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "FK_e55cc4bc84ecd45b89a33d7db26" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
