import React from 'react';
import backgroundImage from './background.jpg';

import {
  Container,
  Row,
  Col,
  // Button,
  Card,
  // Table,
  // Nav,
  // Navbar,
  // Form,
} from 'react-bootstrap';
import LocationDropdown from './LocationDropdown';

import './home.css';
import logo from './logo.png'; // Import your logo image file here

const backgroundStyle = {
  width: '100%',
  minHeight: '100vh',
  backgroundImage: `url(${backgroundImage})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  

};

function HomePage() {
  return (
    
    <div style={backgroundStyle}>
   
        <Container style={{ paddingTop: '40px' }}>
          <h1 align="center" style={{fontStyle: 'italic'}}>Welcome to our Gym: Your Fitness Destination</h1>
        </Container>
      <Container className="Jumbotron">
        <Row className="my-4">
          <Col md={6}>
            <Card className="card-color">
              <Card.Body>
                <Card.Title>Free Trial</Card.Title>
                <Card.Text>Price: $0</Card.Text>
                <Card.Text>
                  <ul>
                    <li>Access to gym equipment for 7 days</li>
                    <li>1 class during the trial period</li>
                    <li>No personal training sessions</li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="card-color">
              <Card.Body>
                <Card.Title>Classic Membership</Card.Title>
                <Card.Text>Price: $80/month</Card.Text>
                <Card.Text>
                  <ul>
                    <li>Unlimited access to gym equipment</li>
                    <li>10 classes per month</li>
                    <li>2 personal training sessions per month</li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* Add more membership cards here */}
        </Row>
        <Row>
          <Col align="center">
            {/* <p class="select-text"> Select Location in the Dropdown to see classes available</p> */}
            <LocationDropdown
              aria-label="Select location"
              asDropdown={true}
            />
          </Col>
        </Row>
      </Container>
      
    
      <footer className="mt-4 py-4 border-top">
        <Container fluid>
          <Row>
            <Col className="text-center">
              <p>Gym Contact Information</p>
            </Col>
            <Col className="text-center">
              <p>Social Media Links</p>
            </Col>
            <Col className="text-center">
              <p>Additional Resources and Quick Links</p>
            </Col>
          </Row>
        </Container>
      </footer>
 
  </div>
  );
}

export default HomePage;
