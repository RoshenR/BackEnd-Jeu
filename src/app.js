import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import gamesRoutes from './routes/games.routes.js';
import libraryRoutes from './routes/library.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.js';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { openapiSpec } from './docs/openapi.js';

const app = express();
let requestCount = 0;
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    const startedAt = new Date().toISOString();
    console.log(`[${startedAt}] ➡️  ${req.method} ${req.originalUrl} received`);

    res.on('finish', () => {
        const endedAt = new Date().toISOString();
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        requestCount += 1;
        console.log(
            `[${endedAt}] ✅ ${req.method} ${req.originalUrl} handled in ${durationMs.toFixed(
                2
            )}ms | total=${requestCount}`
        );
    });

    next();
});


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api', (req, res) =>
    res.json({ status: 'ok', name: 'Game Library', docs: '/docs', health: '/api/health' })
);

app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);
app.use('/library', libraryRoutes);
app.use('/admin', adminRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(errorHandler);

export default app;
