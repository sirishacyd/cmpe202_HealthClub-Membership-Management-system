import React, { useState, useEffect } from 'react';
// import './HoursCount.css';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Alert } from 'react-bootstrap';
function HoursCount({ locationId }) {
    const [hoursData, setHoursData] = useState([]);

    useEffect(() => {
        async function fetchHoursData() {
            try {
                const {data} = await axios.get(`http://127.0.0.1:8000/api/loghoursCount/${locationId}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `token ${localStorage.getItem('token')}`,
                         "Access-Control-Allow-Origin": "*"
                    }
                });
                console.log(data)
                setHoursData(data[0]);
            } catch (error) {
                console.error('Error fetching hours data:', error);
                setHoursData([]);
            }
        }
        fetchHoursData();
    }, [locationId]);

    if (!hoursData) {
        return <div>Loading...</div>;
    }

    const dailyData = {
        labels: hoursData.map(type => type.type),
        datasets: [
            {
                label: 'Daily Hours',
                data: hoursData.map(type => type.type),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const weeklyData = {
        labels: hoursData.map(type => type.type),
        datasets: [
            {
                label: 'Weekly Hours',
                data: hoursData.map(type => type.type),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
        ],
    };

    const monthlyData = {
        labels: hoursData.map(type => type.type),
        datasets: [
            {
                label: 'Monthly Hours',
                data: hoursData.map(type => type.type),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

return (
    <div className="HoursCount">
        <h3>Daily Hours</h3>
        <Bar data={dailyData} />

        <h3>Weekly Hours</h3>
        <Bar data={weeklyData} />

        <h3>Monthly Hours</h3>
        <Bar data={monthlyData} />
    </div>
);
}

export default HoursCount;