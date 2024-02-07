import { UserRepository } from '../../src/user/user.repository';
import { UserFixture } from '../helper/fixtures/user.fixture';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { testDataSourceInstance } from '../helper/conn';
import * as bcrypt from 'bcrypt';

describe('Users', () => {
  const testDataSource = testDataSourceInstance;
  let app: INestApplication;
  let userFixture: UserFixture;
  let userRepository: UserRepository;

  beforeAll(async () => {
    await testDataSource.initializeTest();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(testDataSource)
      .compile();

    const dataSource = moduleRef.get<DataSource>(DataSource);
    userFixture = new UserFixture(dataSource);
    userRepository = moduleRef.get<UserRepository>(UserRepository);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await testDataSource.dropDatabase();
    await app.close();
  });

  it(`/GET users`, async () => {
    await userFixture.create(10);
    const res = await request(app.getHttpServer()).get('/users').expect(200);
    expect(res.body.length).toBe(10);
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
});
