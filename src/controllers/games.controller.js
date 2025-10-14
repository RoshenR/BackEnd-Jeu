import { prisma } from '../config/prisma.js';

export async function listGames(req, res, next) {
    try {
        const games = await prisma.game.findMany({ orderBy: { id: 'asc' } });
        res.json(games);
    } catch (e) { next(e); }
}

export async function createGame(req, res, next) {
    try {
        const { title, publisher, year, coverUrl } = req.body;
        const game = await prisma.game.create({ data: { title, publisher, year, coverUrl } });
        res.status(201).json(game);
    } catch (e) { next(e); }
}

export async function deleteGame(req, res, next) {
    try {
        const id = Number(req.params.gameId);
        await prisma.userGame.deleteMany({ where: { gameId: id } });
        await prisma.game.delete({ where: { id } });
        res.status(204).end();
    } catch (e) { next(e); }
}
