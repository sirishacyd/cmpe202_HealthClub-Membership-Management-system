import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';


function AddTrainings() {
  const urlPost = process.env.REACT_APP_BACKEND_URL+'/api/addClassSchedules/';
  const [instructorName, setInstructorName] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const config = {
    headers: { 'Authorization': 'token ' + localStorage.getItem("token"), 'Content-Type': 'application/json' }
  };


  const handleAlertDismiss = () => {
    setError('');
    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let location_id;
      try {
          let location= JSON.parse(localStorage.getItem('location'));
          location_id=location.location_id;
      }
      catch (err){
          setError('Please select a location.');
          return
      }


      const postdata = {
          instructor_name: instructorName,
          training_type: trainingType,
          max_capacity: maxCapacity,
          location_id : location_id,
          start_time: startTime,
          end_time: endTime
      };
    if (instructorName && trainingType && maxCapacity && startTime && endTime ) {
        axios.post(urlPost, postdata, config)
        .then(response => {
            // Handle success response here
            console.log(response.data);
            setInstructorName('');
            setTrainingType('');
            setMaxCapacity('');
            setStartTime('');
            setEndTime('');
            // Display success message here
            setSuccess('Training added successfully.');
        })
        .catch(error => {
            console.log(error.response.data);
            // Handle error response here
            if (error.response.data.error) {
                setError(error.response.data.error);
            } else {
                alert('Something went wrong. Please try again later.');
        }
      });
  } else {
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
          <Form.Label className="mr-3">Instructor Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Instructor Name" value={instructorName} onChange={(event) => setInstructorName(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Training Type</Form.Label>
          <Form.Control type="text" placeholder="Enter Training Name" value={trainingType} onChange={(event) => setTrainingType(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Maximum Capacity</Form.Label>
          <Form.Control type="number" placeholder="Enter Maximum Capacity" value={maxCapacity} onChange={(event) => setMaxCapacity(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Start Time</Form.Label>
          <Form.Control type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">End Time</Form.Label>
          <Form.Control type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Training
        </Button>
      </Form>
    </Container>
  )
}

export default AddTrainings;
