import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const secret = 'secret'

async function verifyToken(token: string): Promise<ITokenPayload> {
    return new Promise<ITokenPayload>((resolve, reject) => {
        jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded: ITokenPayload) => {
            if (err) {
                return reject(err);
            }
            return resolve(decoded);
        });
    });
}

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