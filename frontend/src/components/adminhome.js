// Import the react JS packages
import React,{useEffect, useState} from "react";
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
import EquipmentChart from './EquipmentChart';
import HoursCount from './HoursCount';

import { Chart, registry } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement,Legend, Tooltip } from 'chart.js';
import moment from 'moment';
import { Alert } from 'react-bootstrap';
registry.add(ArcElement,Legend, Tooltip);

// Define the Login function.
export const AdminHome = ({selectedLocation}) => {
     const [message, setMessage] = useState('');

     const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'));
  const [endDate, setEndDate] = useState(moment().add(1, 'months').format('YYYY-MM-DDTHH:mm:ss'));
  
  const [mychartData, setmyChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  console.log(selectedLocation.location_id);
  var mylocationId = 1;
  if(selectedLocation.location_id){
    mylocationId = selectedLocation.location_id;
  };

     useEffect(() => {
        if(localStorage.getItem('token') === null){                   
            window.location.href = '/login'
        }
        else if (localStorage.getItem('user_type') === "Admin"){
         (async () => {
           try {
            setMessage(localStorage.getItem('first_name'));
            const myurl  = process.env.REACT_APP_BACKEND_URL+"/api/enrollmentstats/?location_id="+mylocationId+"&start_time="+moment(startDate).utc().format('YYYY-MM-DDTHH:mm:ss')+"&end_time="+moment(endDate).utc().format('YYYY-MM-DDTHH:mm:ss');
    axios.get(myurl,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${localStorage.getItem('token')}`,
        'Access-Control-Allow-Origin': '*'
      },
    })
    .then(response => {
      
      console.log(mychartData);
      const labels = response.data.map(d => d["training_type"]);
      const counts = response.data.map(d => d["count"]);
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8B008B', '#FF00FF', '#9400D3'];
      const backgroundColors = labels.map((_, index) => colors[index % colors.length]);
      console.log(labels);
      console.log(counts);
      const someData = {
        labels:labels,
        datasets: [{
          label: 'Enrollments',
          data: counts,
          backgroundColor: backgroundColors
        }],
        options: {
            legend: {
              display:true,
              position: 'right',
            },
          width: 400,
          height: 400,
        },
      };
      setmyChartData(someData);


      setIsLoading(false);
    })
    .catch(error => {
    });
 
          } catch (e) {
            console.log('not auth')
          }
         })()}
         else {window.location.href = '/'};
     }, [isLoading,endDate,startDate,selectedLocation]);


     return (
      <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h3>Welcome to AdminHome ! {message}</h3>
        <div>
        <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '50px',  
  paddingTop: '20px',
  position: 'relative',
  marginBottom: '30px',
}}>
  <div style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }}></div>
  <p style={{
    fontSize: '22px',
    zIndex: 1,
  }}>Enrollment Statistics based on Training type</p>
</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '30px' }}>
              <label htmlFor="start-date">Start Date:</label>
              <input type="datetime-local" id="start-date" value={moment(startDate).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setStartDate(moment(e.target.value).format())} />
              <label htmlFor="end-date">End Date:</label>
              <input type="datetime-local" id="end-date" value={moment(endDate).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setEndDate(moment(e.target.value).format())} />
            </div>
            <div style={{ width: '400px', height: '400px' }}>
            {isLoading ? (<p>Loading...</p>):(mychartData.labels.length === 0?(<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <p>No data to display.</p>
                </div>):(<Doughnut data={mychartData} options={mychartData.options}  />))}
            </div>
          </div>
        </div>
      </div>
  );
  }