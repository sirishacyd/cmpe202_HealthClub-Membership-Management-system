import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';


function SignUpUsers() {
  const urlPost = process.env.REACT_APP_BACKEND_URL+'/api/signup/';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
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
    let postdata = {
          first_name: firstName,
          last_name: lastName,
          username: userName,
          phone: phoneNumber,
          password: password,
          user_type: userType,
      };

    if (postdata.user_type === "Non-member") {
        postdata.password = "default";
    }
    if (postdata.first_name && postdata.last_name && postdata.username && postdata.phone && postdata.password && postdata.user_type) {
        axios.post(urlPost, postdata, config)
        .then(response => {
            // Handle success response here
            console.log(response.data);
            setFirstName('');
            setLastName('');
            setUserName('');
            setPhoneNumber('');
            setPassword('');
            setUserType('');
            // Display success message here
            setSuccess('User added successfully.');
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
          <Form.Label className="mr-3">First Name</Form.Label>
          <Form.Control type="text" placeholder="Enter First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Last Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Username</Form.Label>
          <Form.Control type="text" placeholder="Enter Username" value={userName} onChange={(event) => setUserName(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Phone Number</Form.Label>
          <Form.Control type="text" placeholder="Enter Phone Number" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">Password</Form.Label>
          <Form.Control type="text" placeholder="Enter Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>

        <Form.Group className="d-flex align-items-center">
          <Form.Label className="mr-3">User Type</Form.Label>
            <Form.Select value={userType} onChange={(event) => setUserType(event.target.value)}>
                    <option value="">Select User Type</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Non-member">Non-member</option>
            </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  )
}

export default SignUpUsers;
