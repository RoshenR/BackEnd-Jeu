import { prisma } from '../config/prisma.js';

export async function grantGameToUser(req, res, next) {
    try {
        const { userId, gameId } = req.body;
        await prisma.userGame.upsert({
            where: { userId_gameId: { userId, gameId } },
            update: {},
            create: { userId, gameId }
        });
        res.status(201).json({ message: 'Granted' });
    } catch (e) { next(e); }
}
