import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Outlet, Route, Routes} from "react-router-dom";
import LogHours from "./LogHours";
import {MemberHome} from "./memberhome";

function TopNav() {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/memberhome/home">Home</Nav.Link>
                            <Nav.Link href="/memberhome/loghours">Log Hours</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="home" element={<MemberHome/>} />
                <Route path="loghours" element={<LogHours/>}/>
            </Routes>
            <Outlet />
        </>
    );
}

export default TopNav;