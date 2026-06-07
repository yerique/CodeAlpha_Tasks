import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Retrieve all events sorted by date, appending booking statistics
export const getEvents = async (req, res) => {
    try {
        // Find all events sorted chronologically (nearest date first)
        const events = await Event.find().sort({ date: 1 }).lean(); 

        // Map through events to dynamically compute availability statistics
        const eventsWithStats = await Promise.all(events.map(async (event) => {
            const bookedCount = await Registration.countDocuments({ 
                event: event._id,
                status: 'registered' // Only count active bookings
            });
            
            return { 
                ...event, 
                booked: bookedCount,
                isSoldOut: bookedCount >= event.capacity,
                isPast: new Date(event.date) < new Date() // Flags events that are in the past
            };
        }));

        return res.json(eventsWithStats);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Create a new event listing (restricted to Admin accounts)
export const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        return res.status(201).json(event);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update an existing event's details (restricted to Admin accounts)
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the event by ID and apply body payload updates
        const updatedEvent = await Event.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true }
        );
        
        return res.json(updatedEvent);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Permanently delete an event and clean up associated registrations (restricted to Admin accounts)
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Remove all registration entries associated with the deleted event
        await Registration.deleteMany({ event: id });
        
        // Remove the event entry itself
        await Event.findByIdAndDelete(id);
        
        return res.json({ message: 'Event and associated registrations deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
