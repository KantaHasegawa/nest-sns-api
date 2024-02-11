import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { AuthBearerGuard } from '../auth/auth.bearer.guard';
import { TweetPostDto } from './tweet.post.dto';
import { User } from '../user/user';
import { AuthRolePremiumGuard } from '../auth/auth.role.premium.guard';
import { S3 } from '@aws-sdk/client-s3';

@UseGuards(AuthBearerGuard)
@Controller('tweets')
export class TweetController {
  constructor(
    @Inject('S3') private s3Client: S3,
    private tweetService: TweetService,
  ) {}

  @Get('')
  async index() {
    return this.tweetService.findAll();
  }

  @UseGuards(AuthRolePremiumGuard)
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
