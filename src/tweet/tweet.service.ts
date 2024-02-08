import { Tweet } from './tweet';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TweetPostDto } from './tweet.post.dto';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  async findAll(): Promise<Tweet[]> {
    return this.tweetRepository.find();
  }

  async create(dto: TweetPostDto): Promise<Tweet> {
    return this.tweetRepository.save(dto);
  }

  async delete(id: string) {
    return this.tweetRepository.delete(id);
  }
}
