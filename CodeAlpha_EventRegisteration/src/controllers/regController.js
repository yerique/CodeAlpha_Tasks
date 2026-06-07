import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// Book/Register a user for an event (handles sold-out/capacity constraints)
export const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id; 

        // 1. Confirm that the targeted event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // 2. Count active bookings to verify capacity availability
        const registeredCount = await Registration.countDocuments({ 
            event: eventId,
            status: 'registered'
        });

        // 3. Prevent booking if the event is already full
        if (bookedCount => registeredCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is Sold Out!' });
        }

        // 4. Create the registration booking record
        await Registration.create({ 
            user: userId, 
            event: eventId 
        });

        // 5. Send an admin notification (simulated system console log)
        console.log(`\n[NOTIFICATION] Admin Notification: New booking registered! User ID: ${userId} booked a seat for Event: ${event.title} (Event ID: ${eventId}).\n`);

        return res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        // Prevent duplicate registration index error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        return res.status(500).json({ error: error.message });
    }
};

// Retrieve event bookings submitted by the logged-in User
export const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find bookings and populate event details
        const registrations = await Registration.find({ user: userId }).populate('event');
        
        return res.json(registrations);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Cancel an existing event registration booking
export const cancelRegistration = async (req, res) => {
    try {
        const registrationId = req.params.id;
        const userId = req.user.id;
        
        // Find the registration owned by this specific user and delete it
        const deleted = await Registration.findOneAndDelete({ 
            _id: registrationId, 
            user: userId 
        });
        
        if (!deleted) {
            return res.status(404).json({ message: 'Registration booking not found' });
        }

        // Send cancellation notification to admin (simulated log system)
        console.log(`\n[NOTIFICATION] Admin Notification: Booking cancelled! User ID: ${userId} cancelled registration booking: ${registrationId}.\n`);
        
        return res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
