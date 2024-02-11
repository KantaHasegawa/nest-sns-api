import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLikes1707642419300 implements MigrationInterface {
  name = 'AddLikes1707642419300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_5497266aa41890676a2c3a993c3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` DROP FOREIGN KEY \`FK_f568d16a7b03e1fc6157339c919\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`likes\` (\`tweet_id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, INDEX \`IDX_da44986e692742c8a5c6d91be5\` (\`tweet_id\`), INDEX \`IDX_3f519ed95f775c781a25408917\` (\`user_id\`), PRIMARY KEY (\`tweet_id\`, \`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_da44986e692742c8a5c6d91be5b\` FOREIGN KEY (\`tweet_id\`) REFERENCES \`tweets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_3f519ed95f775c781a254089171\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_3f519ed95f775c781a254089171\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_da44986e692742c8a5c6d91be5b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3f519ed95f775c781a25408917\` ON \`likes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_da44986e692742c8a5c6d91be5\` ON \`likes\``,
    );
    await queryRunner.query(`DROP TABLE \`likes\``);
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_f568d16a7b03e1fc6157339c919\` FOREIGN KEY (\`follow_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`relations\` ADD CONSTRAINT \`FK_5497266aa41890676a2c3a993c3\` FOREIGN KEY (\`follower_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
