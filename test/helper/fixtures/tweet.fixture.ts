import { DataSource } from 'typeorm';
import { Chance } from 'chance';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../src/user/user';
import { Tweet } from '../../../src/tweet/tweet';

export class TweetFixture {
  dataSource: DataSource;
  chance: Chance.Chance;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.chance = new Chance.Chance();
  }

  async createByParams(user: User, content: string) {
    const t = new Tweet();
    t.id = uuidv4();
    t.user = user;
    t.content = content;
    return await this.dataSource.getRepository(Tweet).save(t);
  }
}
