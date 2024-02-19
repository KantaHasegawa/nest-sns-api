import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

export class S3CustomClient {
  constructor(private s3: S3) {}

  async getPresignedURL(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: 'nest-sns', Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async uploadImage(key, base64Image: string): Promise<void> {
    const decodedFile = Buffer.from(base64Image, 'base64');
    const command = new PutObjectCommand({
      Bucket: 'nest-sns',
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
      endpoint: `${config.get<string>('S3_HOST')}:9000`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.get<string>('S3_USER'),
        secretAccessKey: config.get<string>('S3_PASSWORD'),
      },
    });
    return new S3CustomClient(s3);
  },
};
