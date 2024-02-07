import { DataSource } from 'typeorm';
import { Chance } from 'chance';
import { v4 as uuidv4 } from 'uuid';
import { User, UserIgnoreSensitive } from '../../../src/user/user';
import * as bcrypt from 'bcrypt';

export class UserFixture {
  dataSource: DataSource;
  chance: Chance.Chance;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.chance = new Chance.Chance();
  }

  async create(count: number) {
    const users: UserIgnoreSensitive[] = [];
    for (let i = 0; i < count; i++) {
      const u = new User();
      u.id = uuidv4();
      u.name = this.chance.word({ length: 10 });
      u.password = this.chance.word({ length: 10 });
      await this.dataSource.getRepository(User).save(u);
      users.push(u.UserIgnoreSensitive());
    }
  }

  async createByParams(name: string, password: string) {
    const u = new User();
    u.id = uuidv4();
    u.name = name;
    u.password = await bcrypt.hash(password, 10);
    await this.dataSource.getRepository(User).save(u);
    return u.UserIgnoreSensitive();
  }
}
