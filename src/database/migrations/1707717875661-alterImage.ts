import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterImage1707717875661 implements MigrationInterface {
    name = 'AlterImage1707717875661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tweets\` CHANGE \`image_url\` \`image_key\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tweets\` DROP COLUMN \`image_key\``);
        await queryRunner.query(`ALTER TABLE \`tweets\` ADD \`image_key\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tweets\` DROP COLUMN \`image_key\``);
        await queryRunner.query(`ALTER TABLE \`tweets\` ADD \`image_key\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tweets\` CHANGE \`image_key\` \`image_url\` varchar(255) NULL`);
    }

}
