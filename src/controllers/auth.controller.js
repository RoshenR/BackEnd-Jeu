import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) return res.status(409).json({ message: 'Email already used' });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { email, passwordHash } });
        res.status(201).json({ id: user.id, email: user.email });
    } catch (e) { next(e); }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.passwordHash)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ token });
    } catch (e) { next(e); }
}

export async function me(req, res) {
    res.json({ id: req.user.sub, email: req.user.email, role: req.user.role });
}
