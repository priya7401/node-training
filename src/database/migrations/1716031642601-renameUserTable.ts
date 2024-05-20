import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserTable1716031642601 implements MigrationInterface {
    name = 'RenameUserTable1716031642601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying, "mobile_number" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invalidate_token_before" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_350c2c34c6fdd4b292ab6e77879" UNIQUE ("mobile_number"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
