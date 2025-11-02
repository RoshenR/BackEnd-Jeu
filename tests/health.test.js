import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Health', () => {
    it('GET /api/health -> 200 {status:"ok"}', async () => {
        const res = await request(app).get('/api/health'); // ✅ /api ici
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ status: 'ok' });
    });
});
