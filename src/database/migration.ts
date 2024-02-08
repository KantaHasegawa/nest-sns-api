import { User } from '../user/user';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { Role } from '../role/role';
import { Tweet } from '../tweet/tweet';

export const MigrationDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'sns',
  entities: [User, Role, Tweet],
  synchronize: true,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'custom_migration_table',
});
