import { DataSource, Repository } from 'typeorm';
import { User, UserIgnoreSensitive } from './user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAllIgnoreSensitive(): Promise<UserIgnoreSensitive[]> {
    const users = await this.find();
    return users.map((user) => user.UserIgnoreSensitive());
  }
}
