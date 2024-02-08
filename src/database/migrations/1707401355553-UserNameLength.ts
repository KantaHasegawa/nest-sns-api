import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserNameLength1707401355553 implements MigrationInterface {
  name = 'UserNameLength1707401355553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`name\` varchar(10) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\` (\`name\`)`,
    );
  }
}
