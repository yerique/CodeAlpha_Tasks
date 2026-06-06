import express from 'express';
import { createShortUrl, getUrlStats, redirectToOriginalUrl } from '../controllers/urlController.js';

const router = express.Router();

// Route to shorten a long URL (accepts optional custom shortCode alias)
router.post("/shorten", createShortUrl);

// Route to handle redirecting short codes back to the original destination
router.get("/:shortCode", redirectToOriginalUrl);

// Route to query and retrieve click statistics for a specific shortCode
router.get("/stats/:shortCode", getUrlStats);

export default router;