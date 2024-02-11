import { DataSource } from 'typeorm';
import { Chance } from 'chance';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../src/user/user';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../src/role/role';

export class UserFixture {
  dataSource: DataSource;
  chance: Chance.Chance;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.chance = new Chance.Chance();
  }

  async createMany(count: number) {
    const users: User[] = [];
    const basicRole = await this.dataSource
      .getRepository<Role>(Role)
      .findOne({ where: { roleNumber: 1 } });
    for (let i = 0; i < count; i++) {
      const u = new User();
      u.name = this.chance.name();
      u.password = await bcrypt.hash(this.chance.word({ length: 10 }), 10);
      u.role = basicRole;
      await this.dataSource.getRepository(User).save(u);
      users.push(u);
    }
    return users;
  }

  async create() {
    const basicRole = await this.dataSource
      .getRepository<Role>(Role)
      .findOne({ where: { roleNumber: 1 } });
    const u = new User();
    u.name = this.chance.name();
    u.password = await bcrypt.hash(this.chance.word({ length: 10 }), 10);
    u.role = basicRole;
    return await this.dataSource.getRepository(User).save(u);
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
