import { DataSource } from 'typeorm';
import { Chance } from 'chance';
import { v4 as uuidv4 } from 'uuid';
import { User, UserIgnoreSensitive } from '../../../src/user/user';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../src/role/role';

export class UserFixture {
  dataSource: DataSource;
  chance: Chance.Chance;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.chance = new Chance.Chance();
  }

  async create(count: number) {
    const users: UserIgnoreSensitive[] = [];
    const basicRole = await this.dataSource
      .getRepository<Role>(Role)
      .findOne({ where: { roleNumber: 1 } });
    for (let i = 0; i < count; i++) {
      const u = new User();
      u.id = uuidv4();
      u.name = this.chance.word({ length: 10 });
      u.password = await bcrypt.hash(this.chance.word({ length: 10 }), 10);
      u.role = basicRole;
      await this.dataSource.getRepository(User).save(u);
      users.push(u.UserIgnoreSensitive());
    }
  }

  async createByParams(name: string, password: string, roleNumber: number) {
    const u = new User();
    u.id = uuidv4();
    u.name = name;
    u.password = await bcrypt.hash(password, 10);
    u.role = await this.dataSource
      .getRepository(Role)
      .findOne({ where: { roleNumber: roleNumber } });
    await this.dataSource.getRepository(User).save(u);
    return u.UserIgnoreSensitive();
  }
}
