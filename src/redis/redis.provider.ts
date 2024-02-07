import { createClient } from 'redis';

export const RedisProvider = {
  provide: 'REDIS',
  useFactory: async () => {
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    return client;
  },
};
