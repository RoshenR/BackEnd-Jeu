import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

const rand = () => Math.random().toString(36).slice(2);
const email = `user_${rand()}@maets.io`;
const password = 'pass123';

describe('Auth', () => {
    it('POST /auth/register -> 201', async () => {
        const res = await request(app).post('/auth/register').send({ email, password });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
    });

    it('POST /auth/login -> 200 token', async () => {
        const res = await request(app).post('/auth/login').send({ email, password });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token').that.is.a('string');
    });
});
