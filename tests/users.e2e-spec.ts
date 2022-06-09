import { App } from '../src/app';
import { boot } from '../src';
import request from 'supertest';

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});
describe('users e2e', () => {
  it('register error ', async () => {
    const res = await request(application.app).post('/users/register').send({
      email: 'test@mail.ru',
      password: 'test',
    });
    expect(res.statusCode).toBe(422);
  });
  it('login success', async () => {
    const res = await request(application.app).post('/users/login').send({
      email: 'test@mail.ru',
      password: 'test',
    });
    expect(res.body.jwt).not.toBeUndefined();
  });
  it('login wrong', async () => {
    const res = await request(application.app).post('/users/login').send({
      email: 'test@mail.ru',
      password: 'wrong',
    });
    expect(res.statusCode).toBe(401);
  });
  it('info success', async () => {
    const login = await request(application.app).post('/users/login').send({
      email: 'test@mail.ru',
      password: 'test',
    });
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer ${login.body.jwt}`);
    expect(res.body.email).toBe('test@mail.ru');
  });
  it('info wrong', async () => {
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer wrongToken`);
    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
