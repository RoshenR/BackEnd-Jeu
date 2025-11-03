import { prisma } from '../config/prisma.js';
import { GameConfig } from '../models/GameConfig.model.js';

export async function myLibraryService(userId) {
    const items = await prisma.userGame.findMany({
        where: { userId },
        include: { game: true }
    });
    return {
        status: 200,
        body: items.map(x => ({ addedAt: x.addedAt, ...x.game }))
    };
}

export async function addToLibraryService(userId, gameId) {
    const exists = await prisma.game.findUnique({ where: { id: gameId } });
    if (!exists) return { status: 404, body: { message: 'Game not found' } };

    // Empêche les doublons (PK composite côté Prisma)
    await prisma.userGame.upsert({
        where: { userId_gameId: { userId, gameId } },
        create: { userId, gameId },
        update: {},
    });
    return { status: 201, body: { message: 'Added' } };
}

export async function removeFromLibraryService(userId, gameId) {
    const result = await prisma.userGame.deleteMany({
        where: { userId, gameId }
    });
    if (result.count === 0) {
        return { status: 404, body: { message: 'Not in library' } };
    }
    return { status: 204, body: null };
}

export async function getConfigService(userId, gameId) {
    const cfg = await GameConfig.findOne({ userId, gameId }).lean();
    return { status: 200, body: cfg || { userId, gameId, settings: {} } };
}

export async function upsertConfigService(userId, gameId, settings) {
    const cfg = await GameConfig.findOneAndUpdate(
        { userId, gameId },
        { $set: { settings, updatedAt: new Date() } },
        { upsert: true, new: true }
    ).lean();
    return { status: 200, body: cfg };
}
