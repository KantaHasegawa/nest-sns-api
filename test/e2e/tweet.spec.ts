import { INestApplication } from '@nestjs/common';
import { testDataSourceInstance } from '../helper/conn';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { TweetFixture } from '../helper/fixtures/tweet.fixture';
import { UserFixture } from '../helper/fixtures/user.fixture';
import { Chance } from 'chance';
import * as request from 'supertest';
import { AuthBearerStrategy } from '../../src/auth/auth.bearer.strategy';

describe('Tweet', () => {
  const chance = new Chance();
  const testDataSource = testDataSourceInstance;
  let app: INestApplication;
  let tweetFixture: TweetFixture;
  let userFixture: UserFixture;
  const mockRedisClient = {
    hSet: jest.fn(),
  };

  beforeAll(async () => {
    await testDataSource.initializeTest();
    tweetFixture = new TweetFixture(testDataSource);
    userFixture = new UserFixture(testDataSource);
    const [current] = await userFixture.create(1);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(testDataSource)
      .overrideProvider('REDIS')
      .useValue(mockRedisClient)
      .compile();

    app = moduleRef.createNestApplication();
    const mockAuthBearerStrategy = moduleRef.get(AuthBearerStrategy);
    jest.spyOn(mockAuthBearerStrategy, 'validate').mockResolvedValue(current);
    await app.init();
  });

  afterAll(async () => {
    await testDataSource.dropDatabase();
    await app.close();
  });

  it(`/GET tweets`, async () => {
    const [user] = await userFixture.create(1);
    await tweetFixture.createByParams(user, chance.sentence());
    const res = await request(app.getHttpServer())
      .get('/tweets')
      .set('Authorization', 'Bearer token')
      .expect(200);
    expect(res.body.length).toBe(1);
  });
});
