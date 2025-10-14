import { Router } from 'express';
import { listGames, createGame, deleteGame } from '../controllers/games.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const r = Router();
r.get('/', requireAuth, listGames);
r.post('/', requireAuth, requireAdmin, createGame);
r.delete('/:gameId', requireAuth, requireAdmin, deleteGame);
export default r;
