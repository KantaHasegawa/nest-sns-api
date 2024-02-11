import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3Provider = {
  provide: 'S3',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new S3({
      region: 'ap-northeast-1',
      endpoint: `${config.get<string>('S3_HOST')}:9000`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.get<string>('S3_USER'),
        secretAccessKey: config.get<string>('S3_PASSWORD'),
      },
    });
  },
};
