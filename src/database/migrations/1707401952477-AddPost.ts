import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPost1707401952477 implements MigrationInterface {
  name = 'AddPost1707401952477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tweets\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tweets\` ADD CONSTRAINT \`FK_8039099215c037f10c11b0cf228\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tweets\` DROP FOREIGN KEY \`FK_8039099215c037f10c11b0cf228\``,
    );
    await queryRunner.query(`DROP TABLE \`tweets\``);
  }
}
