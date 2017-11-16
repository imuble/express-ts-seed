import * as jwt from 'jsonwebtoken';

const secret = 'secret';
const accessTokenDuration = 3600;
const refreshTokenDuration = 3600 * 24 * 30;

export enum TokenTypes {
    ACCESS_TOKEN = "ACCESS_TOKEN",
    REFRESH_TOKEN = "REFRESH_TOKEN"
}

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
export async function signRefreshToken(id: string, logoutVersion: number): Promise<string> {
    const payload: ITokenPayload = {
        id: id,
        type: TokenTypes.REFRESH_TOKEN,
        logoutVersion: logoutVersion
    }
    const signedToken = sign(payload, refreshTokenDuration);
    return signedToken;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}
export async function signTokens(id: string, logoutVersion: number): Promise<ITokens> {
    return {
        accessToken: await signAccessToken(id),
        refreshToken: await signRefreshToken(id, logoutVersion),
    }
}
