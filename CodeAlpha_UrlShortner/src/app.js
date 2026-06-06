import express from 'express';
import router from './routes/urlRoutes.js';

const app = express()
app.use("/", router)

export default app