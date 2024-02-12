import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from '../tweet/tweet';
import { Repository } from 'typeorm';
import { TweetPostDto } from '../tweet/tweet.post.dto';
import { User } from '../user/user';

@Processor('tweet')
export class TweetConsumer {
  constructor(
    @Inject('S3') private s3Client: S3,
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  @Process()
  async tweet(job: { data: { user: User; dto: TweetPostDto } }) {
    try {
      const objectKey = `${Math.random().toString(36).slice(2)}.jpeg`;
      await this.uploadImage(objectKey, job.data.dto.image);
      const t = new Tweet();
      t.user = job.data.user;
      t.content = job.data.dto.content;
      t.imageKey = objectKey;
      await this.tweetRepository.save(t);
      return;
    } catch (e) {
      console.log(e);
    }
    return;
  }

  private async uploadImage(key, base64Image: string): Promise<void> {
    const decodedFile = Buffer.from(base64Image, 'base64');
    const command = new PutObjectCommand({
      Bucket: 'nest-sns',
      Key: key,
      Body: decodedFile,
      ContentType: 'image/jpeg',
      ContentDisposition: 'inline',
    });

    await this.s3Client.send(command);
  }
}
