import request from 'supertest';
import app from '../src/app.js';

describe('Auth', () => {
    it('register & login', async () => {
        const email = `t${Date.now()}@t.dev`;
        await request(app).post('/auth/register').send({ email, password: 'xxyyzz' }).expect(201);
        const res = await request(app).post('/auth/login').send({ email, password: 'xxyyzz' }).expect(200);
        expect(res.body.token).toBeDefined();
    });
});
