import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from './src/config/config.js';
import User from './src/models/User.js';
import Event from './src/models/Event.js';
import Registration from './src/models/Registration.js';

const seedDB = async () => {
    try {
        // 1. Connect to DB
        await mongoose.connect(config.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // 2. Clear existing data (starts fresh every time)
        await User.deleteMany({});
        await Event.deleteMany({});
        await Registration.deleteMany({});

        // 3. Create a Test Admin and User
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        });

        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword,
            role: "user"
        });

        console.log('Test Users created! (Password: 123456)');

        // 4. Create Test Events
        await Event.create([
            {
                title: "Tech Summit 2026",
                description: "The biggest tech meetup in Pune.",
                date: new Date('2026-02-15'),
                location: "SPPU Auditorium",
                capacity: 100
            },
            {
                title: "Java Spring Boot Workshop",
                description: "Hands-on coding session.",
                date: new Date('2026-03-10'),
                location: "Online",
                capacity: 50
            }
        ]);

        console.log('Test Events created!');
        
        // 5. Exit process
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();