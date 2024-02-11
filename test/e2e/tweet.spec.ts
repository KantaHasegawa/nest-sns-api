import { INestApplication } from '@nestjs/common';
import { testDataSourceInstance } from '../helper/conn';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { TweetFixture } from '../helper/fixtures/tweet.fixture';
import { UserFixture } from '../helper/fixtures/user.fixture';
import { Chance } from 'chance';
import * as request from 'supertest';
import { AuthBearerStrategy } from '../../src/auth/auth.bearer.strategy';
import { Tweet } from '../../src/tweet/tweet';
import { User } from '../../src/user/user';

describe('Tweet', () => {
  const chance = new Chance();
  const testDataSource = testDataSourceInstance;
  let moduleRef: TestingModule;
  let app: INestApplication;
  let tweetFixture: TweetFixture;
  let userFixture: UserFixture;
  let current: User;
  let currentPremium: User;
  const mockRedisClient = {};

  beforeAll(async () => {
    await testDataSource.initializeTest();
    tweetFixture = new TweetFixture(testDataSource);
    userFixture = new UserFixture(testDataSource);
    current = await userFixture.create();
    currentPremium = await userFixture.createPremium();
    moduleRef = await Test.createTestingModule({
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
    await tweetFixture.createByParams(current, chance.sentence());
    const res = await request(app.getHttpServer())
      .get('/tweets')
      .set('Authorization', 'Bearer token')
      .expect(200);
    expect(res.body.length).toBe(1);
  });

  it(`/POST tweets`, async () => {
    const params = {
      content: chance.sentence(),
    };
    await request(app.getHttpServer())
      .post('/tweets')
      .send(params)
      .set('Authorization', 'Bearer token')
      .expect(201);
    const act = await testDataSource.getRepository<Tweet>(Tweet).findOne({
      where: { user: current, content: params.content },
    });
    expect(act.content).toBe(params.content);
  });

  it('likes', async () => {
    const mockAuthBearerStrategy = moduleRef.get(AuthBearerStrategy);
    jest
      .spyOn(mockAuthBearerStrategy, 'validate')
      .mockResolvedValue(currentPremium);
    const user = await userFixture.create();
    const tweet = await tweetFixture.createByParams(user, chance.sentence());
    tweet.user = undefined;
    await request(app.getHttpServer())
      .post(`/tweets/${tweet.id}/likes`)
      .set('Authorization', 'Bearer token')
      .expect(201);
    const res = await request(app.getHttpServer())
      .get('/tweets/likes')
      .set('Authorization', 'Bearer token')
      .expect(200);
    const resTweet = new Tweet();
    resTweet.id = res.body[0].id;
    resTweet.content = res.body[0].content;
    expect(resTweet).toEqual(tweet);
  });
});
