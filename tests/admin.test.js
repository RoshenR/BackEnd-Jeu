import './helpers/test-env.js';
import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { stubPrismaDelegate } from './helpers/prisma.js';

const adminToken = jwt.sign({ sub: 1, email: 'admin@example.com', role: 'ADMIN' }, process.env.JWT_SECRET);
const userToken = jwt.sign({ sub: 2, email: 'user@example.com', role: 'USER' }, process.env.JWT_SECRET);

describe('Admin routes', () => {
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

    it('POST /admin/grant -> 401 without token', async () => {
        const res = await request(app).post('/admin/grant').send({ userId: 1, gameId: 2 });
        expect(res.status).to.equal(401);
        expect(res.body).to.deep.equal({ message: 'Missing token' });
    });

    it('POST /admin/grant -> 403 for non admin user', async () => {
        const res = await request(app)
            .post('/admin/grant')
            .auth(userToken, { type: 'bearer' })
            .send({ userId: 1, gameId: 2 });

        expect(res.status).to.equal(403);
        expect(res.body).to.deep.equal({ message: 'Admin only' });
    });

    it('POST /admin/grant -> 201 grants a game to user', async () => {
        const { upsert } = stubPrismaDelegate(sandbox, 'userGame', { upsert: { userId: 1, gameId: 2 } });

        const res = await request(app)
            .post('/admin/grant')
            .auth(adminToken, { type: 'bearer' })
            .send({ userId: 1, gameId: 2 });

        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal({ message: 'Granted' });
        expect(upsert.calledWithMatch({ create: { userId: 1, gameId: 2 } })).to.be.true;
    });
});