import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNewModuleTypes1719065359676 implements MigrationInterface {
    name = 'AddedNewModuleTypes1719065359676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."permissions_module_name_enum" RENAME TO "permissions_module_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."permissions_module_name_enum" AS ENUM('project', 'donor', 'payment', 'role', 'permission', 'attachment', 'auth')`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "module_name" TYPE "public"."permissions_module_name_enum" USING "module_name"::"text"::"public"."permissions_module_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_module_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."permissions_module_name_enum_old" AS ENUM('project', 'donor', 'payment')`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "module_name" TYPE "public"."permissions_module_name_enum_old" USING "module_name"::"text"::"public"."permissions_module_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_module_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."permissions_module_name_enum_old" RENAME TO "permissions_module_name_enum"`);
    }

}
