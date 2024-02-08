import { Controller, Get, UseGuards } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { AuthBearerGuard } from '../auth/auth.bearer.guard';
@UseGuards(AuthBearerGuard)
@Controller('tweets')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Get('')
  async index() {
    return this.tweetService.findAll();
  }

  // @Post('')
  // async create(@Body() dto: TweetPostDto) {
  //   return this.tweetService.create(dto);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.tweetService.delete(id);
  // }
}
