import { Tweet } from './tweet';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { TweetPostDto } from './tweet.post.dto';
import { User } from '../user/user';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class TweetService {
  constructor(
    @Inject('S3') private s3Client: S3,
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  async findAll(options?: FindManyOptions<Tweet>): Promise<Tweet[]> {
    const tweets = await this.tweetRepository.find(options);
    const tweetsWithURL = Promise.all(
      tweets.map(async (t) => {
        if (!t.imageKey) {
          return t;
        }
        try {
          t.imageURL = await this.getPresignedURL(t.imageKey);
          return t;
        } catch (e) {
          console.log(e);
          return t;
        }
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

  async create(current: User, dto: TweetPostDto): Promise<Tweet> {
    const tweet = new Tweet();
    tweet.content = dto.content;
    tweet.user = current;

    if (dto.image) {
      const decodedFile = Buffer.from(dto.image, 'base64');
      const objectKey = `${Math.random().toString(36).slice(2)}.jpeg`;
      tweet.imageKey = objectKey;
      try {
        await this.uploadImage(objectKey, decodedFile);
      } catch (e) {
        throw new Error('Failed to upload image');
      }
    }

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

  private async uploadImage(key, image: Buffer): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: 'nest-sns',
      Key: key,
      Body: image,
      ContentType: 'image/jpeg',
      ContentDisposition: 'inline',
    });

    await this.s3Client.send(command);
  }

  private async getPresignedURL(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: 'nest-sns', Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
