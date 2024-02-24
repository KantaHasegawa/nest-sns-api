import { UserRepository } from '../../src/user/user.repository';
import { UserFixture } from '../helper/fixtures/user.fixture';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import * as bcrypt from 'bcrypt';
import { AuthBearerStrategy } from '../../src/auth/auth.bearer.strategy';
import { User } from '../../src/user/user';

describe('Users', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userFixture: UserFixture;
  let userRepository: UserRepository;
  let current: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = moduleRef.get<DataSource>(DataSource);
    userFixture = new UserFixture(dataSource);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    current = await userFixture.create();

    app = moduleRef.createNestApplication();
    const mockAuthBearerStrategy = moduleRef.get(AuthBearerStrategy);
    jest.spyOn(mockAuthBearerStrategy, 'validate').mockResolvedValue(current);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
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
    followdUser.ignoreSensitive();
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
    const resUser = new User();
    resUser.id = res.body[0].id;
    resUser.name = res.body[0].name;
    expect(resUser).toEqual(followdUser);
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
