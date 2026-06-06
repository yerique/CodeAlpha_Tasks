import mongoose from 'mongoose';

// Schema defining job applications submitted by candidates
const applicationSchema = new mongoose.Schema({
    // ID reference to the applied job
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    // ID reference to the Candidate user submitting the application
    candidate: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Path string to the uploaded PDF resume file
    resume: { 
        type: String, 
        required: true 
    },
    // Current review status of the application
    status: {
        type: String,
        enum: ['pending', 'interview', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true }); // Enable automatic creation and update timestamps

// Ensure a candidate cannot apply to the same job post multiple times
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
