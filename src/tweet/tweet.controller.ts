import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { AuthBearerGuard } from '../auth/auth.bearer.guard';
import { TweetPostDto } from './tweet.post.dto';
import { User } from '../user/user';

@UseGuards(AuthBearerGuard)
@Controller('tweets')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Get('')
  async index() {
    return this.tweetService.findAll();
  }

  @Get('likes')
  async likes(@Request() req) {
    const current = req.user as User;
    return await this.tweetService.likes(current);
  }

  @Post('')
  async create(@Request() req, @Body() dto: TweetPostDto) {
    const current = req.user as User;
    return this.tweetService.create(current, dto);
  }

  @Post(':id/likes')
  async like(@Request() req, @Param('id') id: string) {
    const current = req.user as User;
    return await this.tweetService.like(current, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.tweetService.delete(id);
    return;
  }
}
