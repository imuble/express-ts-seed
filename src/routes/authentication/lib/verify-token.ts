import * as jwt from 'jsonwebtoken';

const secret = 'secret'

function isTokenPayload(object: any): object is ITokenPayload {
    return 'id' in object && 'type' in object
}
export default async function verifyToken(token: string): Promise<ITokenPayload> {
    return new Promise<ITokenPayload>((resolve, reject) => {
        jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            if (isTokenPayload(decoded)) {
                return resolve(decoded);
            }
            else return reject(new Error('Invalid format on token.'));
        });
    });
}