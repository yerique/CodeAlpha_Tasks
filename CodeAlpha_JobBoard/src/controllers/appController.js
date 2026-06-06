import Application from '../models/Application.js';

// Apply for a vacancy (requires uploading a PDF resume via multer)
export const applyForJob = async (req, res) => {
    try {
        // Enforce file uploads validation
        if (!req.file) {
            return res.status(400).json({ message: 'Resume file required' });
        }

        const { jobId } = req.body;
        const userId = req.user.id;

        // Save application record mapping job, candidate, and file path
        const application = await Application.create({
            job: jobId,
            candidate: userId,
            resume: req.file.path
        });

        // Notify employer (simulated console notification system)
        console.log(`\n[NOTIFICATION] Employer Notification: New application received! Candidate ID: ${userId} has applied for Job ID: ${jobId}. Resume uploaded to: ${req.file.path}\n`);

        return res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        // MongoDB duplicate key error check (candidate cannot apply to the same job twice)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Already applied for this position' });
        }
        return res.status(500).json({ error: error.message });
    }
};

// Retrieve list of candidate applications for a specific job (restricted to Employer accounts)
export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const apps = await Application.find({ job: jobId }).populate('candidate', 'name email');
        return res.json(apps);
    } catch (error) { 
        return res.status(500).json({ error: error.message }); 
    }
};

// Retrieve applications submitted by the logged-in Candidate
export const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        // Populate full Job schemas so candidate sees title, company, etc.
        const apps = await Application.find({ candidate: userId }).populate('job');
        return res.json(apps);
    } catch (error) { 
        return res.status(500).json({ error: error.message }); 
    }
};

// Update status of an application (e.g. accepted, interview, rejected)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        return res.json(app);
    } catch (error) { 
        return res.status(500).json({ error: error.message }); 
    }
};
