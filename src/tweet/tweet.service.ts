import { Tweet } from './tweet';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { TweetPostDto } from './tweet.post.dto';
import { User } from '../user/user';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { S3CustomClient } from '../s3/s3.provider';

@Injectable()
export class TweetService {
  constructor(
    @InjectQueue('tweet') private tweetQueue: Queue,
    @Inject('S3') private s3CustomClient: S3CustomClient,
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  async findAll(options?: FindManyOptions<Tweet>): Promise<Tweet[]> {
    const tweets = await this.tweetRepository.find(options);
    const tweetsWithURL = Promise.all(
      tweets.map(async (t) => {
        if (!t.imageKey) {
          return t;
        }
        t.imageURL = await this.s3CustomClient.getPresignedURL(t.imageKey);
        return t;
      }),
    );
    return tweetsWithURL;
  }

  async likes(current: User) {
    return await this.tweetRepository
      .createQueryBuilder('tweet')
      .innerJoin('tweet.likedUsers', 'users')
      .where('users.id = :id', { id: current.id })
      .getMany();
  }

  async create(current: User, dto: TweetPostDto) {
    const tweet = new Tweet();
    tweet.content = dto.content;
    tweet.user = current;

    if (dto.image) {
      await this.tweetQueue.add(
        {
          user: current,
          dto: dto,
        },
        { lifo: true },
      );
    }
    return;
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
