import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect} from 'react';
import AdminNav from "./AdminNav";
import MemberNav from "./MemberNav";
import {Route, Routes} from "react-router-dom";
export function Navigation() {
   const [isAuth, setIsAuth] = useState(false);
   const [type, setType] = useState('');
   useEffect(() => {
     if (localStorage.getItem('token') !== null) {
        setIsAuth(true); 
      }
    }, [isAuth]);

   useEffect(() => {
       let ut = localStorage.getItem("user_type")
       if (ut !== undefined) {
           setType(ut);
       }
   })
    

     return ( 
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" style={{ height: '80px' }}>
          <Navbar.Brand href="/" style={{ paddingRight: '20px',  paddingLeft: '20px' }}>Healthclub App</Navbar.Brand> 
          <Nav>
         </Nav>           
          <Nav className="me-auto">
              {
                  (() => {
                     if (isAuth) {
                        if (type === "Member") {
                            return <Nav.Link href="/memberhome/home">Home</Nav.Link>
                        } else if (type === "Admin") {
                            return <Nav.Link href="/adminhome/home">Home</Nav.Link>
                        }
                     } else {
                         return <Nav.Link href="/" style={{ fontSize: "1.2em",color: "white" }}>Home</Nav.Link>
                     }
                  })()
              }
          </Nav>
          <Nav style={{ paddingRight: '20px' }} >
          {isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> :  
                    <Nav.Link href="/login" style={{ fontSize: "1.2em",color: "white" }}>Login</Nav.Link>}
          </Nav>
          
        </Navbar>

        <Routes>
            {
                (() => {
                    if (isAuth) {
                        if (type === "Admin") {
                            return <Route path="/adminhome/*" element={<AdminNav/>}/>
                        } else if (type === "Member") {
                            return <Route path="/memberhome/*" element={<MemberNav/>}/>
                        }
                    }
                })()
            }
        </Routes>
       </div>
     );
}