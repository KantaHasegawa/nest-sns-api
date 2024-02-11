import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveForeignKey1707644591248 implements MigrationInterface {
  name = 'RemoveForeignKey1707644591248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tweets\` DROP FOREIGN KEY \`FK_8039099215c037f10c11b0cf228\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_3f519ed95f775c781a254089171\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_da44986e692742c8a5c6d91be5b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_5497266aa41890676a2c3a993c3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_f568d16a7b03e1fc6157339c919\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_f568d16a7b03e1fc6157339c919\` FOREIGN KEY (\`follow_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_5497266aa41890676a2c3a993c3\` FOREIGN KEY (\`follower_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_da44986e692742c8a5c6d91be5b\` FOREIGN KEY (\`tweet_id\`) REFERENCES \`tweets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_3f519ed95f775c781a254089171\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tweets\` ADD CONSTRAINT \`FK_8039099215c037f10c11b0cf228\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
