import './helpers/test-env.js';
import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { stubPrismaDelegate } from './helpers/prisma.js';

const email = 'user@example.com';
const password = 'pass123';

describe('Auth routes', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
        while (sandbox.__prismaRestorers?.length) {
            const restore = sandbox.__prismaRestorers.pop();
            restore();
        }
    });

    it('POST /auth/register -> 201 when email is new', async () => {
        const { create } = stubPrismaDelegate(sandbox, 'user', {
            findUnique: null,
            create: { id: 1, email }
        });
        sandbox.stub(bcrypt, 'hash').resolves('hashed-password');

        const res = await request(app).post('/auth/register').send({ email, password });

        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal({ id: 1, email });
        expect(create.calledWithMatch({ data: { email, passwordHash: 'hashed-password' } })).to.be.true;
    });

    it('POST /auth/register -> 409 when email already exists', async () => {
        const { create } = stubPrismaDelegate(sandbox, 'user', {
            findUnique: { id: 1, email }
        });

        const res = await request(app).post('/auth/register').send({ email, password });

        expect(res.status).to.equal(409);
        expect(res.body).to.deep.equal({ message: 'Email already used' });
        expect(create).to.be.undefined;
    });

    it('POST /auth/login -> 200 with token when credentials are valid', async () => {
        stubPrismaDelegate(sandbox, 'user', {
            findUnique: { id: 1, email, role: 'USER', passwordHash: 'hash' }
        });
        sandbox.stub(bcrypt, 'compare').resolves(true);
        sandbox.stub(jwt, 'sign').returns('signed-token');

        const res = await request(app).post('/auth/login').send({ email, password });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token', 'signed-token');
    });

    it('POST /auth/login -> 401 when credentials are invalid', async () => {
        stubPrismaDelegate(sandbox, 'user', { findUnique: null });

        const res = await request(app).post('/auth/login').send({ email, password });

        expect(res.status).to.equal(401);
        expect(res.body).to.deep.equal({ message: 'Invalid credentials' });
    });

    it('GET /auth/me -> 200 returns decoded user', async () => {
        const token = jwt.sign({ sub: 1, email, role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .get('/auth/me')
            .auth(token, { type: 'bearer' });

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ id: 1, email, role: 'ADMIN' });
    });

    it('GET /auth/me -> 401 when token missing', async () => {
        const res = await request(app).get('/auth/me');
        expect(res.status).to.equal(401);
        expect(res.body).to.deep.equal({ message: 'Missing token' });
    });
});