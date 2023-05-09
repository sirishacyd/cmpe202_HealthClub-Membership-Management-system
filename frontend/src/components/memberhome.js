// Import the react JS packages
import {useEffect, useState} from "react";
import axios from "axios";
import {Routes, Route} from 'react-router-dom'
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Outlet} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Table, Button, Alert } from 'react-bootstrap';
import MemberNav from "./MemberNav";

export const MemberHome = () => {
     const [message, setMessage] = useState('');
     const [member, setMember] = useState([]);
     const [deleteMsg, setDeleteMsg] = useState('');
     const [showAlert, setShowAlert] = useState(false);

     const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/cancelenrollment/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${localStorage.getItem('token')}`,
                    "Access-Control-Allow-Origin": "*"
                }
            });
            const updatedMembers = member.filter((member) => member.Training_id !== id);
            setMember(updatedMembers);
            setDeleteMsg('Enrollment deleted!');
            setShowAlert(true);
        } catch (e) {
        console.log(e);
         }
     };

     useEffect(() => {
        if((localStorage.getItem('token') === null)   ){                   
            window.location.href = '/login'
        }
        else if (localStorage.getItem('user_type') === "Member"){
         (async () => {
           try {
            console.log("VIEWTRAININGS")
             const {data} = await axios.get(   
                            process.env.REACT_APP_BACKEND_URL+'/api/viewmembertrainingenrollment/', {
                             headers: {
                                'Content-Type': 'application/json',
                                'Authorization' : `token ${localStorage.getItem('token')}`,
                                "Access-Control-Allow-Origin": "*"
                                
                             }}
                           );
             console.log(data);
             setMember(data);
             setMessage(localStorage.getItem('first_name'));
          } catch (e) {
            console.log('not auth')
          }
         })()}
         else {window.location.href = '/'};
     }, []);

     useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
            setShowAlert(false);
        }, 2000); // 2000 milliseconds = 2 seconds

        return () => {
        clearTimeout(timer);
        };
    }
    }, [showAlert]);

     return (
       <div>
        <div className="form-signin mt-5 text-center">
            <h3>Hello and Welcome {message} To Our Member Portal!</h3>
        </div>

        <div className="d-flex justify-content-md-center mt-3">

            <div className="row side-row">
                <p id="before-table"></p>
                  {member.length ? (
                    <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
                    <thead>
                        <tr>
                        <th>Instructor Name</th>
                        <th>Training Name</th>
                        <th>Start Date-Time</th>
                        <th>End Date-Time</th>
                        <th>Location Name</th>
                        <th>Location Address</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {member.map((member) =>
                        <tr key={member.Training_id}>
                            <td>{member.Instructor_name}</td>
                            <td>{member.Class_Type}</td>
                            <td>{member.Start_time}</td>
                            <td>{member.End_time}</td>
                            <td>{member.location_name}</td>
                            <td>{member.location_address}</td>
                            <td><Button onClick={() => handleDelete(member.Training_id)} variant="danger">Cancel Enrollment</Button></td>
                        </tr>)}
                    </tbody>
                    </Table>
                    ) : (
                          <Alert variant="info" id="empty-table-message">You are not Enrolled with Any Trainings at the Moment!</Alert>
                    )}
                    <Alert show={showAlert} variant="danger">{deleteMsg}</Alert>
            </div>
        </div>

     </div>

    )}