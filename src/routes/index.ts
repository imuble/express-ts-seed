import { Router } from 'express';

import authenticationRouter from './authentication';

export default function (): Router {
    const router = Router();

    router.use('/', authenticationRouter());

    return router;
}