import Container from 'react-bootstrap/Container';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {Outlet, Route, Routes} from "react-router-dom";
import CheckIn from "./CheckIn";
import Membership from "./Membership";
import AddTrainings from "./AddTrainings";
import SignUpUsers from "./SignUpUsers";
import {AdminHome} from "./adminhome";

function TopNav() {
    const [selectedLocation, setSelectedLocation] = useState(JSON.parse(localStorage.getItem('location')) || {});
    const [locations, setLocations] = useState([]);

    const handleSelect = (eventKey) => {
        const selectedLocation = locations.find(location => location.location_id === parseInt(eventKey));
        setSelectedLocation(selectedLocation);
        localStorage.setItem('location', JSON.stringify(selectedLocation));
    }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/locations/')
            .then(response => response.json())
            .then(data => setLocations(data));
    }, []);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/adminhome/home">Home</Nav.Link>
                            <Nav.Link href="/adminhome/check-in">Check In</Nav.Link>
                            <Nav.Link href="/adminhome/manage">Manage</Nav.Link>
                            <Nav.Link href="/adminhome/addtraining">Add Trainings</Nav.Link>
                            <Nav.Link href="/adminhome/signupusers">Sign Up</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <NavDropdown title={selectedLocation.location_name || "Location"} id="basic-nav-dropdown" onSelect={handleSelect}>
                                {locations.map(location => (
                                    <NavDropdown.Item key={location.location_id} eventKey={location.location_id}>{location.location_name}</NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="home" element={<AdminHome />} />
                <Route path="check-in" element={<CheckIn/>}/>
                <Route path="manage" element={<Membership/>}/>
                <Route path="addtraining" element={<AddTrainings/>}/>
                <Route path="signupusers" element={<SignUpUsers/>}/>
            </Routes>
            <Outlet />
        </>
    );
}

export default TopNav;