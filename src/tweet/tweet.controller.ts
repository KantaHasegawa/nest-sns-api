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
import { UserIgnoreSensitive } from '../user/user';
@UseGuards(AuthBearerGuard)
@Controller('tweets')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Get('')
  async index() {
    return this.tweetService.findAll();
  }

  @Post('')
  async create(@Request() req, @Body() dto: TweetPostDto) {
    const current = req.user as UserIgnoreSensitive;
    return this.tweetService.create(current, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.tweetService.delete(id);
    return;
  }
}
