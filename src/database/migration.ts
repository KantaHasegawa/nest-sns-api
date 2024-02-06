import { User } from '../user/user';
import { DataSource } from 'typeorm';
import 'reflect-metadata';

export const MigrationDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'sns',
  entities: [User],
  synchronize: true,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'custom_migration_table',
});
