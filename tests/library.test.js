import './helpers/test-env.js';
import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { GameConfig } from '../src/models/GameConfig.model.js';
import { stubPrismaDelegate } from './helpers/prisma.js';

const userToken = jwt.sign({ sub: 10, email: 'user@example.com', role: 'USER' }, process.env.JWT_SECRET);

function mockLean(result) {
    return { lean: () => Promise.resolve(result) };
}

describe('Library routes', () => {
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

    it('GET /library -> 200 returns user library', async () => {
        const addedAt = new Date();
        stubPrismaDelegate(sandbox, 'userGame', {
            findMany: [
                { addedAt, game: { id: 42, title: 'Celeste', publisher: 'MattMakesGames', year: 2018 } }
            ]
        });

        const res = await request(app)
            .get('/library')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([
            { id: 42, title: 'Celeste', publisher: 'MattMakesGames', year: 2018, addedAt: addedAt.toISOString() }
        ]);
    });

    it('POST /library/:gameId -> 400 when gameId invalid', async () => {
        const res = await request(app)
            .post('/library/not-a-number')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ message: 'Invalid gameId' });
    });

    it('POST /library/:gameId -> 404 when game does not exist', async () => {
        stubPrismaDelegate(sandbox, 'game', { findUnique: null });

        const res = await request(app)
            .post('/library/1')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(404);
        expect(res.body).to.deep.equal({ message: 'Game not found' });
    });

    it('POST /library/:gameId -> 201 when game added', async () => {
        stubPrismaDelegate(sandbox, 'game', { findUnique: { id: 7 } });
        const { upsert } = stubPrismaDelegate(sandbox, 'userGame', { upsert: undefined });

        const res = await request(app)
            .post('/library/7')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal({ message: 'Added' });
        expect(upsert.calledWithMatch({ create: { userId: 10, gameId: 7 } })).to.be.true;
    });

    it('DELETE /library/:gameId -> 404 when not in library', async () => {
        const { deleteMany } = stubPrismaDelegate(sandbox, 'userGame', { deleteMany: { count: 0 } });

        const res = await request(app)
            .delete('/library/7')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(404);
        expect(res.body).to.deep.equal({ message: 'Not in library' });
        expect(deleteMany.calledWithMatch({ where: { userId: 10, gameId: 7 } })).to.be.true;
    });

    it('DELETE /library/:gameId -> 204 when removed', async () => {
        stubPrismaDelegate(sandbox, 'userGame', { deleteMany: { count: 1 } });

        const res = await request(app)
            .delete('/library/7')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(204);
    });

    it('PUT /library/:gameId/config -> 200 stores configuration', async () => {
        const updated = { userId: 10, gameId: 7, settings: { graphics: 'high' } };
        sandbox.stub(GameConfig, 'findOneAndUpdate').returns(mockLean(updated));

        const res = await request(app)
            .put('/library/7/config')
            .auth(userToken, { type: 'bearer' })
            .send({ settings: { graphics: 'high' } });

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(updated);
    });

    it('GET /library/:gameId/config -> 200 returns stored configuration', async () => {
        const existing = { userId: 10, gameId: 7, settings: { graphics: 'ultra' } };
        sandbox.stub(GameConfig, 'findOne').returns(mockLean(existing));

        const res = await request(app)
            .get('/library/7/config')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(existing);
    });

    it('GET /library/:gameId/config -> 200 returns default when missing', async () => {
        sandbox.stub(GameConfig, 'findOne').returns(mockLean(null));

        const res = await request(app)
            .get('/library/8/config')
            .auth(userToken, { type: 'bearer' });

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ userId: 10, gameId: 8, settings: {} });
    });
});