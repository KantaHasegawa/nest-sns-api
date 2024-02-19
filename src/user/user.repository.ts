import { DataSource, Repository } from 'typeorm';
import { User } from './user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAllIgnoreSensitive(): Promise<User[]> {
    const users = await this.find();
    return users.map((user) => user);
  }
}
