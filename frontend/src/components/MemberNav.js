import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Outlet, Route, Routes} from "react-router-dom";
import LogHours from "./LogHours";
import {MemberHome} from "./memberhome";
import ViewActivities from "./ViewActivities";
import { Enroll } from './Enroll';

function MemberTopNav() {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/memberhome/home">Home</Nav.Link>
                            <Nav.Link href="/memberhome/enroll">Enroll</Nav.Link>
                            <Nav.Link href="/memberhome/loghours">Log Hours</Nav.Link>
                            <Nav.Link href="/memberhome/activities">View Activities</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="home" element={<MemberHome/>} />
                <Route path="enroll" element={<Enroll/>} />
                <Route path="loghours" element={<LogHours/>}/>
                <Route path="activities" element={<ViewActivities />} />
            </Routes>
            <Outlet />
        </>
    );
}
export default MemberTopNav;

