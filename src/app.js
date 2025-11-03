import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));


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
