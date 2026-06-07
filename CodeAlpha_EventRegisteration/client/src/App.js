import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [view, setView] = useState('events'); 
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  
  // Auth State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form State (Used for Create AND Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', capacity: '', description: ''
  });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data);
    } catch (err) { console.error("Error fetching events", err); }
  };

  // --- AUTH ---
  const handleAuth = async () => {
    try {
      if (isLoginMode) {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role); // Save Role
        setToken(res.data.token);
        setUserRole(res.data.role);
        alert('Logged in!');
      } else {
        await axios.post(`${API_URL}/auth/register`, { name, email, password });
        alert('Registered! Please login.');
        setIsLoginMode(true);
      }
    } catch (err) { alert('Authentication Failed'); }
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.clear();
    setView('events');
  };

  // --- ACTIONS ---
  const registerForEvent = async (eventId) => {
    if (!token) return alert('Please login first');
    try {
      await axios.post(`${API_URL}/registrations`, { eventId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Success! Check your dashboard.');
      fetchEvents();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const saveEvent = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isEditing) {
        // UPDATE EXISTING EVENT
        await axios.put(`${API_URL}/events/${currentEventId}`, formData, config);
        alert('Event Updated!');
      } else {
        // CREATE NEW EVENT
        await axios.post(`${API_URL}/events`, formData, config);
        alert('Event Created!');
      }
      
      setView('events'); 
      fetchEvents();     
      setFormData({ title: '', date: '', location: '', capacity: '', description: '' });
      setIsEditing(false);
    } catch (err) { alert('Error saving event'); }
  };

  const prepareEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      location: event.location,
      capacity: event.capacity
    });
    setCurrentEventId(event._id);
    setIsEditing(true);
    setView('form'); 
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Admin: Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Event Deleted');
      fetchEvents();
    } catch (err) { alert('Error deleting event'); }
  };

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyEvents(res.data);
      setView('myEvents');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <header>
        <h1>Campus Event Portal</h1>
        {!token ? (
          <div className="login-box">
            {!isLoginMode && <input placeholder="Name" onChange={e => setName(e.target.value)} style={{marginRight: '5px'}}/>}
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleAuth}>{isLoginMode ? 'Login' : 'Sign Up'}</button>
            <p onClick={() => setIsLoginMode(!isLoginMode)} style={{cursor:'pointer', fontSize:'0.8rem', color:'#007bff', marginTop:'5px'}}>
              {isLoginMode ? 'Create account' : 'Back to Login'}
            </p>
          </div>
        ) : (
          <div>
            <button onClick={() => setView('events')}>All Events</button>
            <button onClick={fetchMyEvents}>My Dashboard</button>
            {userRole === 'admin' && (
              <button onClick={() => { setIsEditing(false); setFormData({ title: '', date: '', location: '', capacity: '', description: '' }); setView('form'); }} style={{backgroundColor: '#28a745'}}>
                + Add Event
              </button>
            )}
            <button onClick={logout} style={{background:'#d9534f'}}>Logout</button>
          </div>
        )}
      </header>

      <main>
        {view === 'form' && (
          <div className="card">
            <h2>{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <input placeholder="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <input type="number" placeholder="Capacity" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
              <button className="primary-btn" onClick={saveEvent}>{isEditing ? 'Update Event' : 'Publish Event'}</button>
              <button onClick={() => setView('events')} style={{marginTop: '10px'}}>Cancel</button>
            </div>
          </div>
        )}

        {view === 'events' && (
          <div className="grid">
            {events.map(ev => (
              <div key={ev._id} className="card" style={{opacity: ev.isPast ? 0.6 : 1}}>
                <h3>{ev.title} {ev.isPast && <span style={{color:'red', fontSize:'0.6em'}}>(ENDED)</span>}</h3>
                <p>{ev.description}</p>
                <p><strong>Date:</strong> {new Date(ev.date).toDateString()}</p>
                <p><strong>Available:</strong> {ev.capacity - ev.booked} / {ev.capacity}</p>
                
                {!ev.isPast && !ev.isSoldOut && (
                  <button className="primary-btn" onClick={() => registerForEvent(ev._id)}>Register Now</button>
                )}
                {ev.isSoldOut && !ev.isPast && (
                  <button disabled style={{backgroundColor: '#ccc', width: '100%', cursor: 'not-allowed'}}>Sold Out</button>
                )}
                {ev.isPast && <p style={{color: '#d9534f', fontWeight: 'bold'}}>Event has ended</p>}

                {userRole === 'admin' && (
                  <div style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                    <button onClick={() => prepareEdit(ev)} style={{backgroundColor: '#ffc107', color: '#000', marginRight: '5px', fontSize: '0.8rem'}}>Edit</button>
                    <button onClick={() => deleteEvent(ev._id)} style={{backgroundColor: 'red', fontSize: '0.8rem'}}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {view === 'myEvents' && (
          <div>
            <h2>My Registrations</h2>
            <div className="list">
              {myEvents.map(reg => (
                <div key={reg._id} className="list-item">
                  <span>{reg.event?.title} ({new Date(reg.event?.date).toLocaleDateString()})</span>
                  <span className="status">Confirmed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;