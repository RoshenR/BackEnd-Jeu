import { Router } from 'express';
import { grantGameToUser } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const r = Router();
r.post('/grant', requireAuth, requireAdmin, grantGameToUser); // body: { userId, gameId }
export default r;
