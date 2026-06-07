import mongoose from 'mongoose';

// Schema defining the events available for registration
const eventSchema = new mongoose.Schema({
    // Official title of the event
    title: { 
        type: String, 
        required: true 
    },
    // Detailed description of the event topic and schedule
    description: { 
        type: String 
    },
    // Event calendar date and start time
    date: { 
        type: Date, 
        required: true 
    },
    // Physical venue or digital location link
    location: { 
        type: String, 
        required: true 
    },
    // Maximum headcount capacity permitted for the event
    capacity: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true }); // Automatically track record creation and updates

const Event = mongoose.model('Event', eventSchema);

export default Event;
