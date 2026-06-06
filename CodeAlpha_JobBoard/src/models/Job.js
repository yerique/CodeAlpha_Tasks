import mongoose from 'mongoose';

// Schema defining the posted job vacancies
const jobSchema = new mongoose.Schema({
    // Official title of the job opening
    title: { 
        type: String, 
        required: true 
    },
    // Company name offering the position
    company: { 
        type: String, 
        required: true 
    },
    // Location of the job (e.g. remote, city, state)
    location: { 
        type: String, 
        required: true 
    },
    // Offered annual or hourly salary
    salary: { 
        type: Number, 
        required: true 
    },
    // Detailed description of job responsibilities and requirements
    description: { 
        type: String, 
        required: true 
    },
    // Job sector category (e.g. IT, Marketing, Sales)
    category: { 
        type: String 
    },
    // ID reference to the Employer user who posted the job
    employer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true }); // Enable automatic creation and update timestamps

const Job = mongoose.model('Job', jobSchema);

export default Job;
