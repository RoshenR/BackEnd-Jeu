import {
    myLibraryService,
    addToLibraryService,
    removeFromLibraryService,
    getConfigService,
    upsertConfigService
} from '../services/library.service.js';

function ensureValidId(gameId, res) {
    if (!Number.isFinite(gameId)) {
        res.status(400).json({ message: 'Invalid gameId' });
        return false;
    }
    return true;
}

export async function myLibrary(req, res, next) {
    try {
        const { status, body } = await myLibraryService(req.user.sub);
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function addToLibrary(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        if (!ensureValidId(gameId, res)) return;

        const { status, body } = await addToLibraryService(req.user.sub, gameId);
        if (status === 204) return res.status(204).end();
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function removeFromLibrary(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        if (!ensureValidId(gameId, res)) return;

        const { status, body } = await removeFromLibraryService(req.user.sub, gameId);
        if (status === 204) return res.status(204).end();
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function getConfig(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        if (!ensureValidId(gameId, res)) return;

        const { status, body } = await getConfigService(req.user.sub, gameId);
        res.status(status).json(body);
    } catch (e) { next(e); }
}


export async function upsertConfig(req, res, next) {
    try {
        const gameId = Number(req.params.gameId);
        if (!ensureValidId(gameId, res)) return;

        const { settings } = req.body || {};
        const { status, body } = await upsertConfigService(req.user.sub, gameId, settings || {});
        res.status(status).json(body);
    } catch (e) { next(e); }
}