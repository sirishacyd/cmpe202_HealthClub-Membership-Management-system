import React from 'react';

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Table,
  Nav,
  Navbar,
  Form,
} from 'react-bootstrap';
import LocationDropdown from './LocationDropdown';
function HomePage () {
  return (
    <>
      <div class="jumbotron">
        <Container>
          <h1>Welcome to Our Gym: Your Fitness Destination</h1>
        </Container>
      </div>

      <Container>
        <Row className="my-4">
          <Col md={4}>
            <Card>
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
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Normal Membership</Card.Title>
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
          <Col className="text-center">
            <p> Select Location in the Dropdown to see classes scheduled</p>
            <LocationDropdown aria-label="Select location" asDropdown={true}/>
          </Col>
        </Row>
      </Container>

      <Container fluid as="footer" className="mt-4 py-4 border-top">
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
    </>
  );
};

export default HomePage;
