import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user';
import { UserPostDto } from './user.post.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: UserPostDto): Promise<User | Error> {
    try {
      const hash = await bcrypt.hash(dto.password, 10);
      const user = new User();
      user.name = dto.name;
      user.password = hash;
    } catch (err) {
      console.log(err);
      return Error('Error creating user');
    }
  }
}
