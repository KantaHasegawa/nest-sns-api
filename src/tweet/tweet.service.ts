import { Tweet } from './tweet';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { TweetPostDto } from './tweet.post.dto';
import { User } from '../user/user';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  async findAll(options?: FindManyOptions<Tweet>): Promise<Tweet[]> {
    return await this.tweetRepository.find(options);
  }

  async likes(current: User) {
    return await this.tweetRepository
      .createQueryBuilder('tweet')
      .innerJoin('tweet.likedUsers', 'users')
      .where('users.id = :id', { id: current.id })
      .getMany();
  }

  async create(current: User, dto: TweetPostDto): Promise<Tweet> {
    const tweet = new Tweet();
    tweet.content = dto.content;
    tweet.user = current;
    return this.tweetRepository.save(tweet);
  }

  async like(current: User, id: string) {
    this.tweetRepository
      .createQueryBuilder()
      .relation(User, 'likedTweets')
      .of({ id: current.id })
      .add(id);
  }

  async delete(id: string) {
    return this.tweetRepository.delete(id);
  }
}
