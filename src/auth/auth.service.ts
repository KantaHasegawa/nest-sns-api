import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS') private redisClient: RedisClientType,
    private userRepository: UserRepository,
  ) {}

  async validate(token: string) {
    const userId = await this.redisClient.hGet(token, 'user');
    const expiredAt = await this.redisClient.hGet(token, 'expiredAt');
    if (!userId || !expiredAt) {
      return undefined;
    }
    if (new Date(expiredAt) < new Date()) {
      await this.redisClient.del(token);
      return undefined;
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user.UserIgnoreSensitive();
  }
}
