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
const HomePage = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Gym Logo</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          <Form inline>
            <Button variant="outline-primary" className="me-2">
              Login
            </Button>
          </Form>
        </Container>
      </Navbar>

      <div class="jumbotron">
        <Container>
          <h1>Welcome to Our Gym: Your Fitness Destination</h1>
        </Container>
      </div>

      <Container>
        <Row>
          <Col className="text-center">
            <LocationDropdown aria-label="Select location" asDropdown={true}/>
          </Col>
        </Row>
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

        <Row id="class-schedules" className="my-4">
          <Col>
            <h2>Class Schedule</h2>
            <Table striped bordered hover responsive>
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
              </Table>
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
