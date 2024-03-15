import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';


describe('swap controller integration test', () => {
  let app: INestApplication;
  let estimationId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should estimate price correctly', async () => {
    const response = await request(app.getHttpServer())
      .get('/swap/estimate-price')
      .query({ pair: 'ETHUSDT', volume: 0.01, operation: 'BUY' })
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('id');
    estimationId = response.body.data.id;
  });

  it('should execute swap correctly', async () => {
    expect(estimationId).toBeDefined();

    const response = await request(app.getHttpServer())
      .post('/swap/execute')
      .send({ estimationId })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
  });
});
