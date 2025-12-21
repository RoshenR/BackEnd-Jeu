import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export async function registerService({ email, password }) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return { status: 409, body: { message: 'Email already used' } };

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    return { status: 201, body: { id: user.id, email: user.email } };
}

export async function loginService({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    const ok = user && await bcrypt.compare(password, user.passwordHash);
    if (!ok) return { status: 401, body: { message: 'Invalid credentials' } };

    const token = jwt.sign(
        { sub: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    return { status: 200, body: { token } };
}
