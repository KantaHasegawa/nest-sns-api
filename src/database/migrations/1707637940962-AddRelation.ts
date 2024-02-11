import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelation1707637940962 implements MigrationInterface {
  name = 'AddRelation1707637940962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`relations\` (\`follow_id\` varchar(36) NOT NULL, \`follower_id\` varchar(36) NOT NULL, INDEX \`IDX_f568d16a7b03e1fc6157339c91\` (\`follow_id\`), INDEX \`IDX_5497266aa41890676a2c3a993c\` (\`follower_id\`), PRIMARY KEY (\`follow_id\`, \`follower_id\`)) ENGINE=InnoDB`,
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
      `DROP INDEX \`IDX_5497266aa41890676a2c3a993c\` ON \`relations\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f568d16a7b03e1fc6157339c91\` ON \`relations\``,
    );
    await queryRunner.query(`DROP TABLE \`relations\``);
  }
}
