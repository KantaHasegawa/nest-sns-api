import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { S3Provider } from '../s3/s3.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  controllers: [TweetController],
  providers: [TweetService, S3Provider],
})
export class TweetModule {}
