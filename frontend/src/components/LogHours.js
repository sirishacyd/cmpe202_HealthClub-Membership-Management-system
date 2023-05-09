import React, { useState, useEffect,useMemo } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

function LogActivityForm() {
  const username = localStorage.getItem('user_id');
  const [activity, setActivity] =  useState('');
  const [duration, setDuration] =  useState('');
  const [distance, setDistance] =  useState('');
  const [calories, setCalories] =  useState('');
  const [timestamp, setTimestamp] =  useState('');
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleAlertDismiss = () => {
    setError('');
    setSuccess('');
  };

  const config = useMemo(() => ({
    headers: { 'Authorization': 'token ' + localStorage.getItem("token"), 'Content-Type': 'application/json' }
  }), []);
  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);
  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'/api/activities/', config)
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }, [config]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiUrl = process.env.REACT_APP_BACKEND_URL+'/api/logHours/';
    const requestData = {
      username: username,
      activity: activity,
      duration: duration,
      distance: distance,
      calories: calories,
      timestamp: timestamp,
    };
    if (username && activity && activity && distance && calories && timestamp ) {
      axios.post(apiUrl, requestData,config)
      .then(response => {
        // console.log(response.data);
        setActivity('');
        setDuration('');
        setDistance('');
        setCalories('');
        setTimestamp('');
        setSuccess('Activity Logged successfully.');
      })
      .catch(error => {
        // console.log(error.response.data);
        setError(error.response.data.error);
      });
  }else {
    // Display an error message if any field is not filled
    setError('Please fill all the fields.');
  }
};

  return (
    <Container className="d-flex justify-content-md-center mt-3">
      <Form style={{ width: '500px' }} onSubmit={handleSubmit}>
        {error && <Alert variant="danger" dismissible onClose={handleAlertDismiss}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={handleAlertDismiss}>{success}</Alert>}
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Activity</Form.Label>
            <Form.Select value={activity} onChange={(event) => setActivity(event.target.value)}>
                    <option value="">Select Activity</option>
                    {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>{activity.type} </option>
                    ))}
            </Form.Select>
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
          <Form.Control type="number" placeholder="Enter Calories" value={calories} onChange={(event) => setCalories(event.target.value)} />
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
