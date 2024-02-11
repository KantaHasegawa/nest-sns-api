import { Tweet } from './tweet';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TweetPostDto } from './tweet.post.dto';
import { User } from '../user/user';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  async findAll(): Promise<Tweet[]> {
    return this.tweetRepository.find();
  }

  async create(current: User, dto: TweetPostDto): Promise<Tweet> {
    const tweet = new Tweet();
    tweet.content = dto.content;
    tweet.user = current;
    return this.tweetRepository.save(tweet);
  }

  async delete(id: string) {
    return this.tweetRepository.delete(id);
  }
}
