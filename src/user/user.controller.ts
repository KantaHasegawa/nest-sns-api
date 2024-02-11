import { UserLoginView } from './user.login.view';
import { UserPostDto } from './user.post.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthBearerGuard } from '../auth/auth.bearer.guard';
import { User } from './user';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthBearerGuard)
  @Get('')
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(AuthBearerGuard)
  @Get('follows')
  async findFllowings(@Request() req) {
    const current = req.user as User;
    return await this.userService.findFllows(current.id);
  }

  @UseGuards(AuthBearerGuard)
  @Get('followers')
  async findFllowers(@Request() req) {
    const current = req.user as User;
    return await this.userService.findFllowers(current.id);
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

  @UseGuards(AuthBearerGuard)
  @Post('follow')
  async follow(@Request() req, @Body('follow_id') followId: string) {
    const current = req.user as User;
    await this.userService.follow(current.id, followId);
  }
}
