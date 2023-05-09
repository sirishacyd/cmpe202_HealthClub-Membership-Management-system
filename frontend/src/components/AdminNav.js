import Container from 'react-bootstrap/Container';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {Outlet, Route, Routes} from "react-router-dom";
import CheckIn from "./CheckIn";
import Membership from "./Membership";
import AddTrainings from "./AddTrainings";
import SignUpUsers from "./SignUpUsers";
import {AdminHome} from "./adminhome";
import EnrollNonmembers from './enrollnonmembers';
import EquipmentChart from './EquipmentChart';
import UserCheckins from "./UserCheckins";
import HoursCount from './HoursCount';

function TopNav() {
    const [selectedLocation, setSelectedLocation] = useState(JSON.parse(localStorage.getItem('location')) || {});
    const [locations, setLocations] = useState([]);

    const handleSelect = (eventKey) => {
        const selectedLocation = locations.find(location => location.location_id === parseInt(eventKey));
        setSelectedLocation(selectedLocation);
        localStorage.setItem('location', JSON.stringify(selectedLocation));
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_URL+'/api/locations/')
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
                            <Nav.Link href="/adminhome/home" style={{color: '#333'}}>Home</Nav.Link>
                            <Nav.Link href="/adminhome/check-in"style={{color: '#333'}}>Check In</Nav.Link>
                            <Nav.Link href="/adminhome/manage"style={{color: '#333'}}>Manage</Nav.Link>
                            <Nav.Link href="/adminhome/addtraining"style={{color: '#333'}}>Add Trainings</Nav.Link>
                            <Nav.Link href="/adminhome/signupusers"style={{color: '#333'}}>Sign Up</Nav.Link>
                            <Nav.Link href="/adminhome/enrollnonmembers"style={{color: '#333'}}>Enroll</Nav.Link>
                            <Nav.Link href="/adminhome/equipmentdashboard"style={{color: '#333'}}>Equipment Dashboard</Nav.Link>
                            <Nav.Link href="/adminhome/usercheckins"style={{color: '#333'}}>Visitor Count Dashboard</Nav.Link>
                            <Nav.Link href="/adminhome/hourscountdashboard"style={{color: '#333'}}>Hours Count</Nav.Link>
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
                <Route path="home" element={<AdminHome selectedLocation={selectedLocation} />} />
                <Route path="check-in" element={<CheckIn/>}/>
                <Route path="manage" element={<Membership/>}/>
                <Route path="addtraining" element={<AddTrainings/>}/>
                <Route path="signupusers" element={<SignUpUsers/>}/>
                <Route path="usercheckins" element={<UserCheckins selectedLocation={selectedLocation}/>}/>
                <Route path="enrollnonmembers" element={<EnrollNonmembers selectedLocation={selectedLocation}/>}/>
                <Route path="equipmentdashboard" element={<EquipmentChart locationId={selectedLocation.location_id}/>}/>
                <Route path="hourscountdashboard" element={<HoursCount locationId={selectedLocation.location_id}/>}/>
            </Routes>
            <Outlet />
        </>
    );
}

export default TopNav;