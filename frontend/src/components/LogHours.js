import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

function LogActivityForm() {
  const [username, setUsername] =  useState('');
  const [activity, setActivity] =  useState('');
  const [duration, setDuration] =  useState('');
  const [distance, setDistance] =  useState('');
  const [calories, setCalories] =  useState('');
  const [timestamp, setTimestamp] =  useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleAlertDismiss = () => {
    setError('');
    setSuccess('');
  };
  const config = {
    headers: { 'Authorization': 'token ' + localStorage.getItem("token"), 'Content-Type': 'application/json' }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const apiUrl = 'http://localhost:8000/api/logHours/';
    const requestData = {
      username: username,
      activity: activity,
      duration: duration,
      distance: distance,
      calories: calories,
      timestamp: timestamp,
    };
    axios.post(apiUrl, requestData,config)
      .then(response => {
        console.log(response.data);
        setUsername('');
        setActivity('');
        setDuration('');
        setDistance('');
        setCalories('');
        setTimestamp('');
        // Display success message here
        setSuccess('Training added successfully.');
        alert('Activity logged successfully!');
      })
      .catch(error => {
        console.log(error.response.data);
        alert('Failed to log activity. Please try again later.');
      });
  };

  return (
    <Container className="d-flex justify-content-md-center mt-3">
      <Form style={{ width: '500px' }} onSubmit={handleSubmit}>
        {error && <Alert variant="danger" dismissible onClose={handleAlertDismiss}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={handleAlertDismiss}>{success}</Alert>}
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Activity</Form.Label>
          <Form.Control type="text" placeholder="Enter Activity" value={activity} onChange={(event) => setActivity(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Duration</Form.Label>
          <Form.Control type="number" placeholder="Enter Duration" value={duration} onChange={(event) => setDuration(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Distance</Form.Label>
          <Form.Control type="number" placeholder="Enter Distance" value={distance} onChange={(event) => setDistance(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Calories</Form.Label>
          <Form.Control type="number" placeholder="Enter Caloreis" value={calories} onChange={(event) => setCalories(event.target.value)} />
        </Form.Group>
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Timestamp</Form.Label>
          <Form.Control type="datetime-local" placeholder="Enter " value={timestamp} onChange={(event) => setTimestamp(event.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log Hours
        </Button>
      </Form>
    </Container>
  )
}

export default LogActivityForm;
