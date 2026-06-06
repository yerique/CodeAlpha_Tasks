import Job from '../models/Job.js';

// Retrieve all jobs with support for optional search queries and categories
export const getJobs = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        
        // Dynamic search filtering
        if (category) {
            query.category = category;
        }
        if (search) {
            // Case-insensitive regex title search
            query.title = { $regex: search, $options: 'i' }; 
        }

        // Fetch jobs and populate employer's company details
        const jobs = await Job.find(query).populate('employer', 'companyName');
        return res.json(jobs);
    } catch (error) { 
        return res.status(500).json({ error: error.message }); 
    }
};

// Handle posting a new job opening (restricted to Employer accounts)
export const createJob = async (req, res) => {
    try {
        // Construct job metadata and assign it to the logged-in Employer ID
        const jobData = { ...req.body, employer: req.user.id };
        const job = await Job.create(jobData);
        
        return res.status(201).json(job);
    } catch (error) { 
        return res.status(500).json({ error: error.message }); 
    }
};

// Retrieve list of vacancies published by the logged-in Employer
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });
        return res.json(jobs);
    } catch (error) { 
        return res.status(500).json({ error: error.message }); 
    }
};
