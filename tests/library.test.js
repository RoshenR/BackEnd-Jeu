import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';
import { Role } from '@prisma/client'; // ⬅️ add this

const rand = () => Math.random().toString(36).slice(2);

async function userToken() {
    const email = `user_${rand()}@maets.io`;
    const password = 'pass123';
    await request(app).post('/auth/register').send({ email, password });
    const login = await request(app).post('/auth/login').send({ email, password });
    return login.body.token;
}

async function adminToken() {
    const email = `admin_${rand()}@maets.io`;
    const password = 'pass123';
    await request(app).post('/auth/register').send({ email, password });

    try {
        await prisma.user.update({ where: { email }, data: { role: Role.ADMIN } });
    } catch {
        await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
    }

    const login = await request(app).post('/auth/login').send({ email, password });
    return login.body.token;
}

describe('Library', () => {
    let userTok, adminTok, gameId;

    before(async () => {
        userTok = await userToken();
        adminTok = await adminToken();

        const created = await request(app)
            .post('/games')
            .set('Authorization', `Bearer ${adminTok}`)
            .send({ title: 'Celeste', publisher: 'MattMakesGames', year: 2018 });

        if (created.status !== 201) throw new Error('Failed to create game');
        gameId = created.body.id;
    });

    it('POST /library/:gameId -> 201', async () => {
        const res = await request(app)
            .post(`/library/${gameId}`)
            .set('Authorization', `Bearer ${userTok}`);
        expect(res.status).to.equal(201);
    });

    it('GET /library -> 200 contains game', async () => {
        const res = await request(app)
            .get('/library')
            .set('Authorization', `Bearer ${userTok}`);
        expect(res.status).to.equal(200);
        const ids = res.body.map(g => g.id || g.gameId || g?.game?.id).filter(Boolean);
        expect(ids).to.include(gameId);
    });

    it('PUT /library/:gameId/config -> 200', async () => {
        const res = await request(app)
            .put(`/library/${gameId}/config`)
            .set('Authorization', `Bearer ${userTok}`)
            .send({ settings: { graphics: 'ultra', controls: { jump: 'space' } } });
        expect(res.status).to.equal(200);
        expect(res.body?.settings?.graphics).to.equal('ultra');
    });

    it('GET /library/:gameId/config -> 200', async () => {
        const res = await request(app)
            .get(`/library/${gameId}/config`)
            .set('Authorization', `Bearer ${userTok}`);
        expect(res.status).to.equal(200);
        expect(res.body?.settings?.controls?.jump).to.equal('space');
    });

    it('DELETE /library/:gameId -> 204', async () => {
        const res = await request(app)
            .delete(`/library/${gameId}`)
            .set('Authorization', `Bearer ${userTok}`);
        expect(res.status).to.equal(204);
    });
});
