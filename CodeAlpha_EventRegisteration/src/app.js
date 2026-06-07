import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());

// Hook API routing layer
app.use('/api', apiRouter);

// Base health check routing
app.get('/', (req, res) => {
    res.send('Event Registration Backend is Running!');
});

export default app;
