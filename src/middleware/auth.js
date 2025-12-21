import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Admin only' });
    next();
}
