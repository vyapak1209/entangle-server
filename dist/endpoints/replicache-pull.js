import { pull } from '../src/pull.js';
import { z } from 'zod';
export async function handlePull(req, res, next) {
    try {
        const userID = z.string().parse(req.query.userID);
        const resp = await pull(userID, req.body);
        res.json(resp);
    }
    catch (e) {
        next(e);
    }
}
