import { z } from 'zod';
import { push } from '../src/push.js';
export async function handlePush(req, res, next) {
    try {
        const userID = z.string().parse(req.query.userID);
        await push(userID, req.body);
        res.status(200).json({});
    }
    catch (e) {
        next(e);
    }
}
