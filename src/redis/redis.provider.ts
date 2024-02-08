import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const RedisProvider = {
  provide: 'REDIS',
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const client = createClient({
      url: `redis://${config.get<string>('REDIS_USERNAME')}:${config.get<string>('REDIS_PASSWORD')}@${config.get<string>('REDIS_HOST')}:6379`,
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    return client;
  },
};
