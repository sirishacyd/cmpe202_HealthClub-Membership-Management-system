import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Outlet, Route, Routes} from "react-router-dom";
import CheckIn from "./CheckIn";
import Membership from "./Membership";
import AddTrainings from "./AddTrainings";
import SignUpUsers from "./SignUpUsers";
import {AdminHome} from "./adminhome";

function TopNav() {
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