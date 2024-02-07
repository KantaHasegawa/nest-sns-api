import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserIgnoreSensitive } from './user';
import { UserPostDto } from './user.post.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { Chance } from 'chance';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async findAll(): Promise<UserIgnoreSensitive[]> {
    return await this.usersRepository.findAllIgnoreSensitive();
  }

  async create(dto: UserPostDto): Promise<UserIgnoreSensitive> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = new User();
    user.name = dto.name;
    user.password = hash;
    try {
      const result = await this.usersRepository.save(user);
      return new UserIgnoreSensitive(result);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('User already exists');
      } else {
        throw err;
      }
    }
  }

  async login(dto: UserPostDto): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { name: dto.name },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid password');
    }
    const token = Chance().guid();
    return token;
  }
}
