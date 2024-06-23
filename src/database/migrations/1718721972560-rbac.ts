import { MigrationInterface, QueryRunner } from "typeorm";

export class Rbac1718721972560 implements MigrationInterface {
    name = 'Rbac1718721972560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."permissions_module_name_enum" AS ENUM('project', 'donor', 'payment')`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "module_name" "public"."permissions_module_name_enum" NOT NULL, "can_create" boolean NOT NULL DEFAULT false, "can_read" boolean NOT NULL DEFAULT false, "can_update" boolean NOT NULL DEFAULT false, "can_delete" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roleId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "role_id" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "role_id" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roleId"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_module_name_enum"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
