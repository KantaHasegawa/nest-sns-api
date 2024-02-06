import { UserPostDto } from './user.post.dto';
import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  async create(@Body() dto: UserPostDto) {
    const result = await this.userService.create(dto);
    if (result instanceof Error) {
      throw result;
    }
    return result;
  }
}
