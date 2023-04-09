// Import the react JS packages
import {useEffect, useState} from "react";
import {Routes, Route} from 'react-router-dom'
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Outlet} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import CheckIn from "./CheckIn";
import Membership from "./Membership";
import AddTrainings from "./AddTrainings";
import SignUpUsers from "./SignUpUsers";
import AdminNav from "./AdminNav";
// Define the Login function.
export const AdminHome = () => {
     const [message, setMessage] = useState('');
     useEffect(() => {
        if(localStorage.getItem('token') === null){                   
            window.location.href = '/login'
        }
        else if (localStorage.getItem('user_type') === "Admin"){
         (async () => {
           try {
            console.log("VIEWTRAININGS")
             const {data} = await axios.get(   
                            'http://localhost:8000/api/viewtrainings/1', {
                             headers: {
                                'Content-Type': 'application/json',
                                'Authorization' : `token ${localStorage.getItem('token')}`,
                                "Access-Control-Allow-Origin": "*"
                                
                             }}
                           );
             console.log(data);
            //  setMessage(data.message);
            setMessage(localStorage.getItem('first_name'));
          } catch (e) {
            console.log('not auth')
          }
         })()}
         else {window.location.href = '/'};
     }, []);
     return (
             <div className="form-signin mt-5 text-center">
                 <h3>Hi {message}. You are a Admin. Welcome to AdminHome</h3>
             </div>
)}