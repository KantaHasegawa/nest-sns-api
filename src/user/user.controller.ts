import { UserLoginView } from './user.login.view';
import { UserPostDto } from './user.post.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
