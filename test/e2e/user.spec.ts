import { UserRepository } from '../../src/user/user.repository';
import { UserFixture } from '../helper/fixtures/user.fixture';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { testDataSourceInstance } from '../helper/conn';
import * as bcrypt from 'bcrypt';
import { AuthBearerStrategy } from '../../src/auth/auth.bearer.strategy';
import { User } from '../../src/user/user';

describe('Users', () => {
  const testDataSource = testDataSourceInstance;
  let app: INestApplication;
  let userFixture: UserFixture;
  let userRepository: UserRepository;
  const mockRedisClient = {
    hSet: jest.fn(),
  };
  let current: User;

  beforeAll(async () => {
    await testDataSource.initializeTest();
    userFixture = new UserFixture(testDataSource);
    current = await userFixture.create();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(testDataSource)
      .overrideProvider('REDIS')
      .useValue(mockRedisClient)
      .compile();

    const dataSource = moduleRef.get<DataSource>(DataSource);
    userFixture = new UserFixture(dataSource);
    userRepository = moduleRef.get<UserRepository>(UserRepository);

    app = moduleRef.createNestApplication();
    const mockAuthBearerStrategy = moduleRef.get(AuthBearerStrategy);
    jest.spyOn(mockAuthBearerStrategy, 'validate').mockResolvedValue(current);
    await app.init();
  });

  afterAll(async () => {
    await testDataSource.dropDatabase();
    await app.close();
  });

  it(`/GET users`, async () => {
    await userFixture.createMany(10);
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer token')
      .expect(200);
    expect(res.body.length).toBe(11);
  });

  it(`/POST users`, async () => {
    const params = {
      name: 'user1',
      password: 'password',
    };
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(params)
      .expect(201);
    const act = await userRepository.findOne({
      where: { id: res.body.id },
    });
    expect(act.name).toBe(params.name);
    expect(await bcrypt.compare(params.password, act.password)).toBe(true);
  });

  it('user follow follower', async () => {
    const followdUser = await userFixture.create();
    const params = {
      follow_id: followdUser.id,
    };

    await request(app.getHttpServer())
      .post('/users/follow')
      .send(params)
      .set('Authorization', 'Bearer token')
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/users/follows')
      .set('Authorization', 'Bearer token')
      .expect(200);
    const act = followdUser.UserIgnoreSensitive();
    expect(res.body[0]).toEqual(act);
  });

  it(`/POST users/login`, async () => {
    const params = {
      name: 'loginuser',
      password: 'password',
    };
    await userFixture.createByParams(params.name, params.password, 1);
    const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(params)
      .expect(201);
    expect(res.body.token).toBeDefined();
  });
});
