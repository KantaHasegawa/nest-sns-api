import { UserLoginView } from './user.login.view';
import { UserPostDto } from './user.post.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthBearerGuard } from '../auth/auth.bearer.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthBearerGuard)
  @Get('')
  async findAll() {
    return await this.userService.findAll();
  }

  @Post('')
  async create(@Body() dto: UserPostDto) {
    const result = await this.userService.create(dto);
    return result;
  }

  @Post('login')
  async login(@Body() dto: UserPostDto): Promise<UserLoginView> {
    const token = await this.userService.login(dto);
    return { token };
  }
}
