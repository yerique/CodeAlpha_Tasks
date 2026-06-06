import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [view, setView] = useState('home'); 
  
  // Data States
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]); 
  const [myApplications, setMyApplications] = useState([]); 
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Search Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState('candidate'); 
  const [companyName, setCompanyName] = useState('');

  // Application State
  const [resumeFile, setResumeFile] = useState(null);

  // Post Job State
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', description: '', category: '' });

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  // UPDATED: Fetch Jobs with Search & Filter
  const fetchJobs = async () => {
    try {
      let query = `${API_URL}/jobs?`;
      if (searchTerm) query += `search=${searchTerm}&`;
      if (categoryFilter) query += `category=${categoryFilter}`;

      const res = await axios.get(query);
      setJobs(res.data);
    } catch (err) { console.error(err); }
  };

  // --- AUTH ---
  const handleAuth = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        setToken(res.data.token);
        setRole(res.data.role);
        setView('home'); 
        fetchJobs(); 
      } else {
        await axios.post(`${API_URL}/auth/register`, { name, email, password, role: userRole, companyName });
        alert('Registered! Please login.');
        setIsLogin(true);
      }
    } catch (err) { alert('Auth Failed'); }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.clear();
    setMyJobs([]);
    setApplications([]);
    setMyApplications([]);
    setView('home'); 
  };

  // --- CANDIDATE ACTIONS ---
  const applyForJob = async (jobId) => {
    if (!resumeFile) return alert('Please select a resume PDF first');
    
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobId', jobId);

    try {
      await axios.post(`${API_URL}/apply`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      alert('Application Submitted!');
    } catch (err) { alert(err.response?.data?.message || 'Error uploading file'); }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyApplications(res.data);
      setView('myApplications');
    } catch (err) { alert('Error fetching applications'); }
  };

  // --- EMPLOYER ACTIONS ---
  const postJob = async () => {
    try {
      await axios.post(`${API_URL}/jobs`, newJob, { headers: { Authorization: `Bearer ${token}` } });
      alert('Job Posted!');
      setView('home');
      fetchJobs();
    } catch (err) { alert('Error posting job'); }
  };

  const viewMyJobs = async () => {
    const res = await axios.get(`${API_URL}/my-posted-jobs`, { headers: { Authorization: `Bearer ${token}` } });
    setMyJobs(res.data);
    setView('myJobs');
  };

  const viewApplications = async (jobId) => {
    const res = await axios.get(`${API_URL}/jobs/${jobId}/applications`, { headers: { Authorization: `Bearer ${token}` } });
    setApplications(res.data);
    setSelectedJobId(jobId);
    setView('applications');
  };

  const updateStatus = async (appId, status) => {
    await axios.put(`${API_URL}/applications/${appId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    viewApplications(selectedJobId); 
  };

  return (
    <div className="container" style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>Job Board Platform 💼</h1>
      
      {!token ? (
        <div className="auth-box">
          <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
          {!isLogin && <input placeholder="Full Name" onChange={e => setName(e.target.value)} />}
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          
          {!isLogin && (
            <div style={{marginBottom: '15px'}}>
              <label>Role: </label>
              <select onChange={e => setUserRole(e.target.value)}>
                <option value="candidate">Candidate</option>
                <option value="employer">Employer</option>
              </select>
              {userRole === 'employer' && <input placeholder="Company Name" onChange={e => setCompanyName(e.target.value)} style={{marginTop:'10px'}}/>}
            </div>
          )}

          <button onClick={handleAuth}>{isLogin ? 'Login' : 'Sign Up'}</button>
          <p onClick={() => setIsLogin(!isLogin)} style={{color: 'blue', cursor: 'pointer'}}>{isLogin ? 'Create Account' : 'Back to Login'}</p>
        </div>
      ) : (
        <div>
          {/* NAVBAR */}
          <div style={{marginBottom: '20px', paddingBottom:'10px', borderBottom:'1px solid #ddd'}}>
            <span style={{marginRight:'15px', fontWeight:'bold'}}>Role: {role.toUpperCase()}</span>
            <button onClick={() => setView('home')}>Find Jobs</button>
            {role === 'employer' && (
              <>
                <button onClick={() => setView('postJob')}>Post Job</button>
                <button onClick={viewMyJobs}>My Posted Jobs</button>
              </>
            )}
            {role === 'candidate' && (
              <button onClick={fetchMyApplications}>My Applications</button>
            )}
            <button onClick={logout} className="danger">Logout</button>
          </div>

          {/* VIEW: JOB LIST (Home with Search) */}
          {view === 'home' && (
            <div>
              <h2>Latest Jobs</h2>
              
              {/* SEARCH BAR SECTION */}
              <div style={{display: 'flex', gap: '10px', marginBottom: '20px', background: '#e9ecef', padding: '15px', borderRadius: '5px'}}>
                <input 
                  placeholder="Search by Title (e.g. Java)" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{marginBottom: 0}}
                />
                <select 
                  onChange={e => setCategoryFilter(e.target.value)} 
                  style={{marginBottom: 0, width: '200px'}}
                >
                  <option value="">All Categories</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                </select>
                <button onClick={fetchJobs} style={{marginBottom: 0}}>Search</button>
              </div>

              {jobs.length === 0 && <p>No jobs found.</p>}
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <h3>{job.title} <span style={{fontSize:'0.8em', color:'gray'}}>at {job.company}</span></h3>
                  <p>{job.location} | ${job.salary} | <strong>{job.category}</strong></p>
                  <p>{job.description}</p>
                  
                  {role === 'candidate' && (
                    <div style={{marginTop:'10px', borderTop:'1px solid #eee', paddingTop:'10px'}}>
                      <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem'}}>Upload Resume (PDF only):</label>
                      <input type="file" accept="application/pdf" onChange={e => setResumeFile(e.target.files[0])} />
                      <button onClick={() => applyForJob(job._id)} className="success">Apply Now</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* VIEW: MY APPLICATIONS */}
          {view === 'myApplications' && (
            <div>
              <h2>My Applied Jobs</h2>
              {myApplications.length === 0 && <p>No applications yet.</p>}
              {myApplications.map(app => (
                <div key={app._id} className="applicant-card">
                  <h3>{app.job?.title || 'Unknown Job'}</h3>
                  <p>{app.job?.company}</p>
                  <p>Status: <strong style={{color: app.status === 'accepted' ? 'green' : 'orange'}}>{app.status.toUpperCase()}</strong></p>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: POST JOB */}
          {view === 'postJob' && (
            <div className="auth-box">
              <h2>Post a New Job</h2>
              <input placeholder="Job Title" onChange={e => setNewJob({...newJob, title: e.target.value})} />
              <input placeholder="Company" onChange={e => setNewJob({...newJob, company: e.target.value})} />
              <input placeholder="Location" onChange={e => setNewJob({...newJob, location: e.target.value})} />
              <input placeholder="Salary" type="number" onChange={e => setNewJob({...newJob, salary: e.target.value})} />
              <input placeholder="Category (IT, Marketing)" onChange={e => setNewJob({...newJob, category: e.target.value})} />
              <textarea placeholder="Description" onChange={e => setNewJob({...newJob, description: e.target.value})} />
              <button onClick={postJob} className="success">Publish Job</button>
            </div>
          )}

          {/* VIEW: MY POSTED JOBS */}
          {view === 'myJobs' && (
            <div>
              <h2>My Posted Jobs</h2>
              {myJobs.map(job => (
                <div key={job._id} className="job-card">
                  <h4>{job.title}</h4>
                  <button onClick={() => viewApplications(job._id)}>View Applicants</button>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: APPLICANTS */}
          {view === 'applications' && (
             <div>
               <h2>Applicants</h2>
               <button onClick={viewMyJobs} className="secondary">Back to My Jobs</button>
               {applications.length === 0 && <p>No applicants yet.</p>}
               {applications.map(app => (
                 <div key={app._id} className="applicant-card">
                   <p><strong>Name:</strong> {app.candidate?.name}</p>
                   <p><strong>Email:</strong> {app.candidate?.email}</p>
                   <p><strong>Status:</strong> {app.status}</p>
                   <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noreferrer">Download Resume</a>
                   <div style={{marginTop: '10px'}}>
                     <button onClick={() => updateStatus(app._id, 'accepted')} className="success">Accept</button>
                     <button onClick={() => updateStatus(app._id, 'rejected')} className="danger">Reject</button>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;