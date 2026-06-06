import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Handles registering a new user (Candidate or Employer)
export const register = async (req, res) => {
    try {
        const { name, email, password, role, companyName } = req.body;

        // Hash the password securely with a salt factor of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user record in the database
        await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role, 
            companyName 
        });

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Handles authenticating credentials and issuing JWT tokens
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Search for user by their unique email address
        const user = await User.findOne({ email });
        
        // Verify credentials (both email lookup and cryptographically compared password)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Sign and issue a JSON Web Token payload containing the user's role and identity
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            config.JWT_SECRET
        );

        return res.json({ 
            token, 
            role: user.role, 
            name: user.name 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
