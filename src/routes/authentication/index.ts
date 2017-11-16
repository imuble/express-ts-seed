import * as express from 'express';

import login from './endpoints/login';
import register from './endpoints/register';
import facebooklogin from './endpoints/facebooklogin';
import refreshToken from './endpoints/refresh';

export default function initRouter(): express.Router {
    const router = express.Router();

    router.post('/register', register);
    router.post('/login', login);
    router.post('/facebooklogin', facebooklogin);
    router.post('/refresh', refreshToken);

    return router;
}