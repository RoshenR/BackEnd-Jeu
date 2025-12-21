import { prisma } from '../config/prisma.js';

export async function listGamesService() {
    const games = await prisma.game.findMany({ orderBy: { id: 'asc' } });
    return { status: 200, body: games };
}

export async function createGameService({ title, publisher, year, coverUrl }) {
    const game = await prisma.game.create({ data: { title, publisher, year, coverUrl } });
    return { status: 201, body: game };
}

export async function deleteGameService(gameId) {
    // Nettoyer la table pivot puis supprimer le jeu
    await prisma.$transaction([
        prisma.userGame.deleteMany({ where: { gameId } }),
        prisma.game.delete({ where: { id: gameId } }),
    ]);
    return { status: 204, body: null };
}
