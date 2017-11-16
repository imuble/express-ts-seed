import { Request, Response } from 'express';
import verifyToken from '../lib/verify-token';

export default async function (req: Request, res: Response, next: Function) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send();
    }
    try {
        const decoded = await verifyToken(token);
        if (decoded) {
            req.state.authenticated = true;
            req.state.decodedToken = decoded;
        }
        else {
            return res.status(401).send();
        }
    }
    catch(e) {

    }
    return next();
}