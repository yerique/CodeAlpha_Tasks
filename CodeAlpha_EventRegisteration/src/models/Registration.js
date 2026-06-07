import mongoose from 'mongoose';

// Schema defining user registrations for specific events
const registrationSchema = new mongoose.Schema({
    // ID reference to the registered User
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // ID reference to the booked Event
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
    // Current status of the event registration booking
    status: {
        type: String,
        enum: ['registered', 'cancelled'],
        default: 'registered'
    }
}, { timestamps: true }); // Automatically track record creation and updates

// Guarantee that a user cannot register for the same event more than once
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
