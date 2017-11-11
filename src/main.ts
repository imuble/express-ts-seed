import * as env from 'dotenv';
import Application from './App'

env.config();
const app = new Application();