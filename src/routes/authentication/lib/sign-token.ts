import * as jwt from 'jsonwebtoken';

const secret = 'secret';
const accessTokenDuration = 3600;
const refreshTokenDuration = 3600 * 24 * 30;

function sign(payload: Object, expiresIn: number): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn }, (err, signed) => {
            if (err) return reject(err);
            return resolve(signed);
        });
    });
}

export async function signAccessToken(id: string): Promise<string> {
    const payload: ITokenPayload = {
        id: id,
        type: TokenTypes.ACCESS_TOKEN
    }
    const signedToken = sign(payload, accessTokenDuration);
    return signedToken;
}
export async function signRefreshToken(id: string): Promise<string> {
    const payload: ITokenPayload = {
        id: id,
        type: TokenTypes.REFRESH_TOKEN
    }
    const signedToken = sign(payload, refreshTokenDuration);
    return signedToken;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}
export async function signTokens(id: string): Promise<ITokens> {
    return {
        accessToken: await signAccessToken(id),
        refreshToken: await signRefreshToken(id),
    }
}