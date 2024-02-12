import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from '../tweet/tweet';
import { Repository } from 'typeorm';
import { TweetPostDto } from '../tweet/tweet.post.dto';
import { User } from '../user/user';
import { S3CustomClient } from '../s3/s3.provider';

@Processor('tweet')
export class TweetConsumer {
  constructor(
    @Inject('S3') private s3CustomClient: S3CustomClient,
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  @Process()
  async tweet(job: { data: { user: User; dto: TweetPostDto } }) {
    const objectKey = `${Math.random().toString(36).slice(2)}.jpeg`;
    await this.s3CustomClient.uploadImage(objectKey, job.data.dto.image);
    const t = new Tweet();
    t.user = job.data.user;
    t.content = job.data.dto.content;
    t.imageKey = objectKey;
    await this.tweetRepository.save(t);
    return;
    return;
  }
}
