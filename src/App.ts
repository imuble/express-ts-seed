import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
const swagger = require( 'swagger-jsdoc' );
const swaggerUi = require('swagger-ui-express');
import AppRouter from './routes';
//import Request from './routes/request';

class Application {
    express: express.Application;

    constructor() {
        this.express = express();
        this.db();
        this.middleware();
        this.routes();

        this.express.listen(process.env.APP_PORT);
    }
    private db() {
        mongoose.connect(process.env.DB_URI, (err: Error) => { if (err) throw err; });
    }
    private middleware() {
        const swaggerJSDoc = require('swagger-jsdoc');

        const spec = swaggerJSDoc(require('../swagger-spec'));
        this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
        this.express.use(bodyParser.json());
        this.express.use((req: express.Request, res, next) => {
            req.state = {};
            return next();
        });
    }
    private routes()  {
        this.express.use('/', AppRouter());
    }
}

export default Application;