import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from '../../src/user/user';
import { patchRole } from '../../src/database/patch/role';
import { Role } from '../../src/role/role';

class TestDataSource extends DataSource {
  constructor() {
    super({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'sns_test',
      entities: [User, Role],
      synchronize: true,
    });
  }

  async initializeTest() {
    await this.initialize();
    await patchRole(this);
  }

  async destroyTest() {
    await this.destroy();
  }

  async dropTest() {
    await this.dropDatabase();
  }
}

export const testDataSourceInstance = new TestDataSource();
