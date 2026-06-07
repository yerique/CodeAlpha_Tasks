import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Handles new user registration (Standard User or Admin accounts)
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash password securely with a strength factor of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user records in the database
        await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role 
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Handles user sign in and issues JWT authentication tokens
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Query the database for the user by their email address
        const user = await User.findOne({ email });

        // Authenticate credentials against password hash comparison
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password credentials' });
        }

        // Sign and issue token payload containing user identity and role settings
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
