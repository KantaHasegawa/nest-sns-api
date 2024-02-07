import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { RedisProvider } from '../redis/redis.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, RedisProvider],
})
export class UserModule {}
