import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBearerStrategy } from './auth.bearer.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthBearerGuard } from './auth.bearer.guard';
import { RedisProvider } from '../redis/redis.provider';
import { UserRepository } from '../user/user.repository';
import { AuthRolePremiumGuard } from './auth.role.premium.guard';

@Module({
  imports: [PassportModule],
  providers: [
    AuthService,
    AuthBearerStrategy,
    AuthBearerGuard,
    AuthRolePremiumGuard,
    RedisProvider,
    UserRepository,
  ],
  exports: [AuthBearerGuard, AuthBearerStrategy, AuthRolePremiumGuard],
})
export class AuthModule {}
