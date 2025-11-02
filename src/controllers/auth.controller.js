import { registerService, loginService } from '../services/auth.service.js';

export async function register(req, res, next) {
    try {
        const { status, body } = await registerService(req.body);
        if (status === 204) return res.status(204).end();
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function login(req, res, next) {
    try {
        const { status, body } = await loginService(req.body);
        if (status === 204) return res.status(204).end();
        res.status(status).json(body);
    } catch (e) { next(e); }
}

export async function me(req, res) {
    res.json({ id: req.user.sub, email: req.user.email, role: req.user.role });
}
