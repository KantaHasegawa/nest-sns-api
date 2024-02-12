import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { S3Provider } from '../s3/s3.provider';
import { TweetConsumer } from '../worker/tweet.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet]),
    BullModule.registerQueue({
      name: 'tweet',
    }),
  ],
  controllers: [TweetController],
  providers: [TweetService, S3Provider, TweetConsumer],
})
export class TweetModule {}
