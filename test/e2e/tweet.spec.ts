import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { TweetFixture } from '../helper/fixtures/tweet.fixture';
import { UserFixture } from '../helper/fixtures/user.fixture';
import { Chance } from 'chance';
import * as request from 'supertest';
import { AuthBearerStrategy } from '../../src/auth/auth.bearer.strategy';
import { User } from '../../src/user/user';
import { patchRole } from '../../src/database/patch/role';

describe('Tweet', () => {
  const chance = new Chance();
  let dataSource: DataSource;
  let moduleRef: TestingModule;
  let app: INestApplication;
  let tweetFixture: TweetFixture;
  let userFixture: UserFixture;
  let current: User;
  let currentPremium: User;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    dataSource = moduleRef.get<DataSource>(DataSource);
    await patchRole(dataSource);
    tweetFixture = new TweetFixture(dataSource);
    userFixture = new UserFixture(dataSource);
    current = await userFixture.create();
    currentPremium = await userFixture.createPremium();
    const mockAuthBearerStrategy = moduleRef.get(AuthBearerStrategy);
    jest.spyOn(mockAuthBearerStrategy, 'validate').mockResolvedValue(current);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
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
    await request(app.getHttpServer())
      .get('/tweets/likes')
      .set('Authorization', 'Bearer token')
      .expect(200);
  });
});
