import mongoose from 'mongoose';

// Schema defining the application users (registered users and admins)
const userSchema = new mongoose.Schema({
    // User's full name
    name: { 
        type: String, 
        required: true 
    },
    // Unique email address used for login and identity verification
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // Hashed password string for credential storage
    password: { 
        type: String, 
        required: true 
    },
    // Access role defining permissions (user or admin)
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
}, { timestamps: true }); // Automatically track record creation and updates

const User = mongoose.model('User', userSchema);

export default User;
