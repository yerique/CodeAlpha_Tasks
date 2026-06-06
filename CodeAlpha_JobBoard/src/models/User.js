import mongoose from 'mongoose';

// Schema defining the users of the system (candidates and employers)
const userSchema = new mongoose.Schema({
    // Full name of the user
    name: { 
        type: String, 
        required: true 
    },
    // Unique email address used for login credentials
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // Hashed password for secure authentication
    password: { 
        type: String, 
        required: true 
    },
    // System role specifying permissions (employer or candidate)
    role: { 
        type: String, 
        enum: ['employer', 'candidate'], 
        default: 'candidate' 
    },
    // Optional company name (populated if the user is an employer)
    companyName: { 
        type: String 
    } 
}, { timestamps: true }); // Enable automatic creation and update timestamps

const User = mongoose.model('User', userSchema);

export default User;
