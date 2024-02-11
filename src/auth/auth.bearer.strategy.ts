import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthBearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(token: string) {
    const redisUser = await this.authService.validate(token);
    if (!redisUser) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOne({
      where: { id: redisUser.id },
      relations: ['role'],
    });
    return user;
  }
}
