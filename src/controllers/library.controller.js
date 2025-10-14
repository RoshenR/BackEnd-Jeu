import { prisma } from '../config/prisma.js';
import { GameConfig } from '../models/GameConfig.model.js';

export async function myLibrary(req, res, next) {
    try {
        const items = await prisma.userGame.findMany({
            where: { userId: req.user.sub },
            include: { game: true }
        });
        res.json(items.map(x => ({ addedAt: x.addedAt, ...x.game })));
    } catch (e) { next(e); }
}

export async function addToLibrary(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        await prisma.userGame.create({ data: { userId: req.user.sub, gameId } });
        res.status(201).json({ message: 'Added' });
    } catch (e) { next(e); }
}

export async function removeFromLibrary(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        await prisma.userGame.delete({ where: { userId_gameId: { userId: req.user.sub, gameId } } });
        res.status(204).end();
    } catch (e) { next(e); }
}

export async function getConfig(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        const cfg = await GameConfig.findOne({ userId: req.user.sub, gameId }).lean();
        res.json(cfg || { userId: req.user.sub, gameId, settings: {} });
    } catch (e) { next(e); }
}

export async function upsertConfig(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        const { settings } = req.body;
        const cfg = await GameConfig.findOneAndUpdate(
            { userId: req.user.sub, gameId },
            { $set: { settings, updatedAt: new Date() } },
            { upsert: true, new: true }
        ).lean();
        res.json(cfg);
    } catch (e) { next(e); }
}
