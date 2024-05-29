import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAttachmentColumnAndRelations1716993438401 implements MigrationInterface {
    name = 'AddedAttachmentColumnAndRelations1716993438401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attachments" ("id" SERIAL NOT NULL, "file_name" character varying NOT NULL, "file_type" character varying NOT NULL, "s3_key" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bb58d9db74df937ab16fe6c7fe0" UNIQUE ("s3_key"), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_attachments_project_attachment_type_enum" AS ENUM('temple_images', 'project_documents', 'temple_main_image')`);
        await queryRunner.query(`CREATE TABLE "project_attachments" ("id" SERIAL NOT NULL, "project_attachment_type" "public"."project_attachments_project_attachment_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "projectId" integer, "attachmentId" integer, CONSTRAINT "REL_438888108e79d97811eefe304f" UNIQUE ("attachmentId"), CONSTRAINT "PK_e0adaaabd364382782d8ef14fcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "FK_e55cc4bc84ecd45b89a33d7db26" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "FK_438888108e79d97811eefe304f5" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "FK_438888108e79d97811eefe304f5"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "FK_e55cc4bc84ecd45b89a33d7db26"`);
        await queryRunner.query(`DROP TABLE "project_attachments"`);
        await queryRunner.query(`DROP TYPE "public"."project_attachments_project_attachment_type_enum"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
    }

}
