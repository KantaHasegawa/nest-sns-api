import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRelations1707642373446 implements MigrationInterface {
  name = 'AlterRelations1707642373446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_5497266aa41890676a2c3a993c3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_f568d16a7b03e1fc6157339c919\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_f568d16a7b03e1fc6157339c919\` FOREIGN KEY (\`follow_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_5497266aa41890676a2c3a993c3\` FOREIGN KEY (\`follower_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_5497266aa41890676a2c3a993c3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_f568d16a7b03e1fc6157339c919\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_f568d16a7b03e1fc6157339c919\` FOREIGN KEY (\`follow_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_5497266aa41890676a2c3a993c3\` FOREIGN KEY (\`follower_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
