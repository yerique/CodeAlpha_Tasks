import express from 'express';
import cors from 'cors';
import fs from 'fs';
import apiRouter from './routes/api.js';

const app = express();

// Automatically construct uploads target folder if it does not exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Global Middlewares
app.use(express.json());
app.use(cors());

// Expose the uploads directory to make resume PDFs accessible
app.use('/uploads', express.static('uploads'));

// Hook api routers
app.use('/api', apiRouter);

// Base health check routing
app.get('/', (req, res) => {
    res.send('Job Board Backend is Running!');
});

export default app;
