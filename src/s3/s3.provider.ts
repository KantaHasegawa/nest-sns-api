import {
  CreateBucketCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

export class S3CustomClient {
  constructor(
    private s3: S3,
    private bucketName: string,
  ) {}

  async getPresignedURL(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async createBucket(): Promise<void> {
    try {
      await this.s3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
    } catch (e) {
      if (e.name !== 'BucketAlreadyOwnedByYou') {
        throw e;
      }
    }
  }

  async uploadImage(key, base64Image: string): Promise<void> {
    const decodedFile = Buffer.from(base64Image, 'base64');
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: decodedFile,
      ContentType: 'image/jpeg',
      ContentDisposition: 'inline',
    });
    await this.s3.send(command);
  }
}

export const S3Provider = {
  provide: 'S3',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const s3 = new S3({
      region: 'ap-northeast-1',
      endpoint: `${config.get<string>('S3_HOST')}:${config.get<string>('S3_PORT')}`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.get<string>('S3_USER'),
        secretAccessKey: config.get<string>('S3_PASSWORD'),
      },
    });
    return new S3CustomClient(s3, config.get<string>('S3_BUCKET'));
  },
};
