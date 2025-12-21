import { Router } from 'express';
import { myLibrary, addToLibrary, removeFromLibrary, getConfig, upsertConfig } from '../controllers/library.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.get('/', requireAuth, myLibrary);
r.post('/:gameId', requireAuth, addToLibrary);
r.delete('/:gameId', requireAuth, removeFromLibrary);
r.get('/:gameId/config', requireAuth, getConfig);
r.put('/:gameId/config', requireAuth, upsertConfig);
export default r;
