import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';
import { Role } from '@prisma/client';

const rand = () => Math.random().toString(36).slice(2);

async function adminToken() {
    const email = `admin_${rand()}@maets.io`;
    const password = 'pass123';

    await request(app).post('/auth/register').send({ email, password });
    try { await prisma.user.update({ where: { email }, data: { role: Role.ADMIN } }); }
    catch { await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } }); }

    const login = await request(app).post('/auth/login').send({ email, password });
    return login.body.token;
}

describe('Games', () => {
    let token; let gameId;

    before(async () => { token = await adminToken(); });

    it('GET /games -> 200', async () => {
        const res = await request(app)
            .get('/games')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('POST /games -> 201 (create)', async () => {
        const res = await request(app)
            .post('/games')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Hollow Knight', publisher: 'Team Cherry', year: 2017 });
        expect(res.status).to.equal(201);
        gameId = res.body.id;
    });

    it('DELETE /games/:id -> 204', async () => {
        const res = await request(app)
            .delete(`/games/${gameId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(204);
    });
});
