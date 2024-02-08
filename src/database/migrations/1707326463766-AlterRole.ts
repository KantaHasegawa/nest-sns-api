import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRole1707326463766 implements MigrationInterface {
  name = 'AlterRole1707326463766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`role_number\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_cfda316a96435db7ccdb965fc9\` (\`role_number\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP INDEX \`IDX_cfda316a96435db7ccdb965fc9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP COLUMN \`role_number\``,
    );
  }
}
