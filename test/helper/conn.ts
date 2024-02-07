import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from '../../src/user/user';

class TestDataSource extends DataSource {
  constructor() {
    super({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'sns_test',
      entities: [User],
      synchronize: true,
    });
  }

  async initializeTest() {
    await this.initialize();
  }

  async destroyTest() {
    await this.destroy();
  }

  async dropTest() {
    await this.dropDatabase();
  }
}

export const testDataSourceInstance = new TestDataSource();
