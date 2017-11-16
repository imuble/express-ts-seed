
import * as https from 'https'

/*

GET graph.facebook.com/debug_token?
     input_token={token-to-inspect}
     &access_token={app-token-or-admin-token}

*/

const appToken = process.env.FB_APP_ID + '|' + process.env.FB_APP_SECRET;

interface TokenCheckData {
    app_id: string;
    application: string;
    expires_at: number;
    is_valid: boolean;
    scopes: string[];
    user_id: string;
}
interface TokenCheckResponse {
    data: TokenCheckData
}
interface FacebookUser {
    name: string;
    id: string;
    email?: string;
}

export function getFbIdByToken(token: string): Promise<TokenCheckResponse> {
    return new Promise((resolve, reject) => {
        https.get('https://graph.facebook.com/debug_token?input_token=' + token + '&access_token=' + appToken, function (res) {
            var body = '';
            res.on('data', function (d) {
                body += d;
            });
            res.on('end', function () {
                var parsed = JSON.parse(body);
                if (parsed.error) {
                    return reject(parsed.error);
                }
                resolve(parsed);
            });
        });
    });
}

export function getFbUserById(id: string): Promise<FacebookUser> {

    let path = '/v2.7/' + id + '?fields=name,email';

    return new Promise((resolve, reject) => {
        var options = {
            host: 'graph.facebook.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                Authorization: 'OAuth ' + appToken
            }
        };
        var req = https.request(options, function (res) {
            var body = '';
            res.on('data', function (d) {
                body += d.toString();
            });
            res.on('end', function () {
                var parsed = JSON.parse(body);
                if (parsed.error) {
                    return reject(parsed.error);
                }
                resolve(parsed);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

export function isTokenCheckResponseValid(data: TokenCheckData): Boolean {
    if (!data) {
        return false
    }


    /* Check if the requesting token is linked with our app id */
    if (data.app_id.valueOf() !== new String(process.env.FB_APP_ID).valueOf()) {
        return false
    }

    /* If the token is invalid */
    if (!data.is_valid) {
        return false
    }

    let now = new Date().getTime();
    let tokenExpiration = data.expires_at * 1000;

    let isExpired = (now > tokenExpiration);
    if (isExpired) {
        return false
    }

    return true;
}