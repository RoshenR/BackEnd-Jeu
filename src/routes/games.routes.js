import { Router } from 'express';
import {
    listGames,
    createGame,
    deleteGame,
    getGame,
    updateGame
} from '../controllers/games.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const r = Router();

// liste accessible à tout utilisateur connecté
r.get('/', requireAuth, listGames);

// détail accessible à tout utilisateur connecté
r.get('/:gameId', requireAuth, getGame);

// création / édition / suppression réservées aux admins
r.post('/', requireAuth, requireAdmin, createGame);
r.put('/:gameId', requireAuth, requireAdmin, updateGame);
r.delete('/:gameId', requireAuth, requireAdmin, deleteGame);

export default r;
