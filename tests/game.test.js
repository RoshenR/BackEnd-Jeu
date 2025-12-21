// import './helpers/test-env.js';
// import request from 'supertest';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import jwt from 'jsonwebtoken';
// import app from '../src/app.js';
// import { stubPrismaDelegate, stubPrismaMethod } from './helpers/prisma.js';
//
// const adminToken = jwt.sign({ sub: 1, email: 'admin@example.com', role: 'ADMIN' }, process.env.JWT_SECRET);
// const userToken = jwt.sign({ sub: 2, email: 'user@example.com', role: 'USER' }, process.env.JWT_SECRET);
//
// describe('Games routes', () => {
//     let sandbox;
//
//     beforeEach(() => {
//         sandbox = sinon.createSandbox();
//     });
//
//     afterEach(() => {
//         sandbox.restore();
//         while (sandbox.__prismaRestorers?.length) {
//             const restore = sandbox.__prismaRestorers.pop();
//             restore();
//         }
//     });
//
//     it('GET /games requires authentication', async () => {
//         const res = await request(app).get('/games');
//         expect(res.status).to.equal(401);
//         expect(res.body).to.deep.equal({ message: 'Missing token' });
//     });
//
//     it('GET /games -> 200 returns games for authenticated user', async () => {
//         const games = [
//             { id: 10, title: 'Celeste', publisher: 'MattMakesGames', year: 2018 },
//             { id: 11, title: 'Hollow Knight', publisher: 'Team Cherry', year: 2017 }
//         ];
//         stubPrismaDelegate(sandbox, 'game', { findMany: games });
//
//         const res = await request(app)
//             .get('/games')
//             .auth(userToken, { type: 'bearer' });
//
//         expect(res.status).to.equal(200);
//         expect(res.body).to.deep.equal(games);
//     });
//
//     it('POST /games -> 403 for non admin', async () => {
//         const res = await request(app)
//             .post('/games')
//             .auth(userToken, { type: 'bearer' })
//             .send({ title: 'New Game' });
//
//         expect(res.status).to.equal(403);
//         expect(res.body).to.deep.equal({ message: 'Admin only' });
//     });
//
//     it('POST /games -> 201 creates game for admin', async () => {
//         const body = { title: 'Stray', publisher: 'BlueTwelve', year: 2022 };
//         const { create } = stubPrismaDelegate(sandbox, 'game', { create: { id: 21, ...body } });
//
//         const res = await request(app)
//             .post('/games')
//             .auth(adminToken, { type: 'bearer' })
//             .send(body);
//
//         expect(res.status).to.equal(201);
//         expect(res.body).to.deep.equal({ id: 21, ...body });
//         expect(create.calledWithMatch({ data: body })).to.be.true;
//     });
//
//     it('GET /games/:id -> 200 when game exists', async () => {
//         stubPrismaDelegate(sandbox, 'game', { findUnique: { id: 33, title: 'Portal 2' } });
//
//         const res = await request(app)
//             .get('/games/33')
//             .auth(userToken, { type: 'bearer' });
//
//         expect(res.status).to.equal(200);
//         expect(res.body).to.deep.equal({ id: 33, title: 'Portal 2' });
//     });
//
//     it('GET /games/:id -> 404 when game missing', async () => {
//         stubPrismaDelegate(sandbox, 'game', { findUnique: null });
//
//         const res = await request(app)
//             .get('/games/999')
//             .auth(userToken, { type: 'bearer' });
//
//         expect(res.status).to.equal(404);
//         expect(res.body).to.deep.equal({ message: 'Game not found' });
//     });
//
//     it('PUT /games/:id -> 200 updates game', async () => {
//         const updated = {
//             id: 44,
//             title: 'Updated',
//             publisher: 'Test',
//             year: 2024,
//             coverUrl: 'http://example.com/cover.png'
//         };
//         const { update } = stubPrismaDelegate(sandbox, 'game', { update: updated });
//
//         const res = await request(app)
//             .put('/games/44')
//             .auth(adminToken, { type: 'bearer' })
//             .send({ title: 'Updated', publisher: 'Test', year: 2024, coverUrl: 'http://example.com/cover.png' });
//
//         expect(res.status).to.equal(200);
//         expect(update.calledWithMatch({ where: { id: 44 } })).to.be.true;
//         expect(res.body).to.deep.equal(updated);
//     });
//
//     it('DELETE /games/:id -> 204 removes game and related entries', async () => {
//         const userGameStub = stubPrismaDelegate(sandbox, 'userGame', {
//             deleteMany: { count: 1 }
//         });
//         const gameStub = stubPrismaDelegate(sandbox, 'game', {
//             delete: { id: 55 }
//         });
//         stubPrismaMethod(sandbox, '$transaction', async actions => Promise.all(actions));
//
//         const res = await request(app)
//             .delete('/games/55')
//             .auth(adminToken, { type: 'bearer' });
//
//         expect(res.status).to.equal(204);
//         expect(userGameStub.deleteMany.calledWithMatch({ where: { gameId: 55 } })).to.be.true;
//         expect(gameStub.delete.calledWithMatch({ where: { id: 55 } })).to.be.true;
//     });
// });