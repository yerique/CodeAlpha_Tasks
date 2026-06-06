import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import * as auth from '../controllers/authController.js';
import * as job from '../controllers/jobController.js';
import * as appCtrl from '../controllers/appController.js';

const router = express.Router();

// --- MULTER STORAGE SETUP (Resume PDF Uploads) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// PDF Mimetype Validation Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF documents are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

// --- SECURITY MIDDLEWARES ---

// Validate Bearer Tokens
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

// Validate Employer Permissions
const verifyEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Employer role privileges required' });
    }
    next();
};

// --- AUTH ROUTE DEFINITIONS ---
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// --- JOB ROUTE DEFINITIONS ---
router.get('/jobs', job.getJobs); // Supports query params: ?search=X&category=Y
router.post('/jobs', verifyToken, verifyEmployer, job.createJob);
router.get('/my-posted-jobs', verifyToken, verifyEmployer, job.getMyJobs);

// --- APPLICATION ROUTE DEFINITIONS ---
router.post('/apply', verifyToken, upload.single('resume'), appCtrl.applyForJob);
router.get('/my-applications', verifyToken, appCtrl.getMyApplications);
router.get('/jobs/:jobId/applications', verifyToken, verifyEmployer, appCtrl.getJobApplications);
router.put('/applications/:id/status', verifyToken, verifyEmployer, appCtrl.updateStatus);

export default router;
