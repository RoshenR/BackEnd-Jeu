import { listGamesService, createGameService, deleteGameService } from '../services/game.service.js';
import { prisma } from '../config/prisma.js';

export async function listGames(req, res, next) {
    try {
        const { status, body } = await listGamesService();
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function createGame(req, res, next) {
    try {
        const { status, body } = await createGameService(req.body);
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function getGame(req, res, next) {
    try {
        const id = Number(req.params.gameId);
        const game = await prisma.game.findUnique({ where: { id } });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (e) { next(e); }
}

export async function updateGame(req, res, next) {
    try {
        const id = Number(req.params.gameId);
        const { title, publisher, year, coverUrl } = req.body;
        const game = await prisma.game.update({
            where: { id },
            data: { title, publisher, year, coverUrl },
        });
        res.json(game);
    } catch (e) { next(e); }
}

export async function deleteGame(req, res, next) {
    try {
        const id = Number(req.params.gameId);
        const { status, body } = await deleteGameService(id);
        if (status === 204) return res.status(204).end();
        res.status(status).json(body);
    } catch (e) { next(e); }
}
