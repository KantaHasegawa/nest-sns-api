import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageColumn1707665246485 implements MigrationInterface {
  name = 'AddImageColumn1707665246485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`FK_8039099215c037f10c11b0cf228\` ON \`tweets\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tweets\` ADD \`image_url\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tweets\` DROP COLUMN \`image_url\``);
    await queryRunner.query(
      `CREATE INDEX \`FK_8039099215c037f10c11b0cf228\` ON \`tweets\` (\`userId\`)`,
    );
  }
}
