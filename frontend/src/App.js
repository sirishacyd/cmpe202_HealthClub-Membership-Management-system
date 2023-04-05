import './App.css';

import React from 'react';

function App() {
  return (
    <>
      <header>
        <img src="image/logo.svg" alt="Gym Logo" className="logo" />
        <nav>
          <button onClick={() => { /* handle navigation */ }}>Home</button>
          <button onClick={() => { /* handle navigation */ }}>Memberships</button>
          <button onClick={() => { /* handle navigation */ }}>Class Schedules</button>
          <button onClick={() => { /* handle navigation */ }}>Contact</button>
          </nav>
        <div className="auth-buttons">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      </header>

      <section className="hero">
        <h1>Welcome to Our Gym: Your Fitness Destination</h1>
        <button>Join Now</button>
      </section>

      <section className="location-selector">
        <select id="location">
          <option>Select Location</option>
          {/* Add location options here */}
        </select>
      </section>

      <section className="memberships">
        <div className="membership-card">
          <h2>Free Trial</h2>
          <p>Price: $0</p>
          <ul>
            <li>Access to gym equipment for 7 days</li>
            <li>1 class during the trial period</li>
            <li>No personal training sessions</li>
          </ul>
          <button>Start Trial</button>
        </div>
        <div className="membership-card">
          <h2>Normal Membership</h2>
          <p>Price: $80/month</p>
          <ul>
            <li>Unlimited access to gym equipment</li>
            <li>10 classes per month</li>
            <li>2 personal training sessions per month</li>
          </ul>
          <button>Join Now</button>
        </div>
        {/* Add more membership cards here */}
      </section>

      <section className="class-schedules section">
      <h2>Class Schedule</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Class</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monday</td>
            <td>6:00 AM - 7:00 AM</td>
            <td>Yoga</td>
            <td>Jane Smith</td>
          </tr>
          <tr>
            <td>Tuesday</td>
            <td>5:00 PM - 6:00 PM</td>
            <td>Cardio Kickboxing</td>
            <td>John Doe</td>
          </tr>
          <tr>
            <td>Wednesday</td>
            <td>7:00 PM - 8:00 PM</td>
            <td>Zumba</td>
            <td>Emily Johnson</td>
          </tr>
          {/* Add more rows with class schedule data here */}
        </tbody>
      </table>
    </section>

      <footer>
        <div className="contact">Gym Contact Information</div>
        <div className="social-media">Social Media Links</div>
        <div className="quick-links">Additional Resources and Quick Links</div>
      </footer>
    </>
  );
}

export default App;