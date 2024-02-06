import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAlter1707241245335 implements MigrationInterface {
  name = 'UserAlter1707241245335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\``,
    );
  }
}
