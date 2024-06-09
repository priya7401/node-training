import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectTable1716896499653 implements MigrationInterface {
    name = 'AddProjectTable1716896499653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "reg_num" character varying NOT NULL, "temple_name" character varying NOT NULL, "location" character varying NOT NULL, "temple_incharge_name" character varying NOT NULL, "temple_incharge_number" character varying NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "estimated_amount" integer, "expensed_amount" integer, "scrapped_reason" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fc8de80bde2614b5eac3178da1d" UNIQUE ("reg_num"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
