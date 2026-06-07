import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import verifyAdmin from '../middleware/roleMiddleware.js';
import * as auth from '../controllers/authController.js';
import * as event from '../controllers/eventController.js';
import * as reg from '../controllers/regController.js';

const router = express.Router();

// --- SECURITY MIDDLEWARE ---

// Verify Bearer Tokens
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).send('Access token required');
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid or expired token');
    }
};

// --- AUTH ROUTE DEFINITIONS ---
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// --- EVENT ROUTE DEFINITIONS ---
router.get('/events', event.getEvents);
router.post('/events', verifyToken, verifyAdmin, event.createEvent);
router.put('/events/:id', verifyToken, verifyAdmin, event.updateEvent);
router.delete('/events/:id', verifyToken, verifyAdmin, event.deleteEvent);

// --- REGISTRATION ROUTE DEFINITIONS ---
router.post('/registrations', verifyToken, reg.registerForEvent);
router.get('/my-registrations', verifyToken, reg.getMyRegistrations);
router.delete('/registrations/:id', verifyToken, reg.cancelRegistration);

export default router;
