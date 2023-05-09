import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Alert, Form } from 'react-bootstrap';

function HoursCount({ locationId }) {
  const [hoursData, setHoursData] = useState({});
  const [selectedChart, setSelectedChart] = useState('daily');

  useEffect(() => {
    async function fetchHoursData() {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/loghoursCount/${locationId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${localStorage.getItem('token')}`,
            'Access-Control-Allow-Origin': '*',
          },
        });
        console.log(data);
        setHoursData(data);
      } catch (error) {
        console.error('Error fetching hours data:', error);
        setHoursData([]);
      }
    }
    fetchHoursData();
  }, [locationId]);

  if (
    !hoursData ||
    !hoursData.daily_hours ||
    !hoursData.weekly_hours ||
    !hoursData.monthly_hours ||
    Object.keys(hoursData.daily_hours).length === 0 ||
    Object.keys(hoursData.weekly_hours).length === 0 ||
    Object.keys(hoursData.monthly_hours).length === 0
  ) {
    return (
    <div style={{width: '850px', height: '365px', margin: '0 auto'}}>
        <Alert variant="info" className="text-center">
            No Data available at the Moment
        </Alert>
    </div>
    );
  }

  // Chart data
    // Sort the keys for each dataset
    const sortedDailyKeys = Object.keys(hoursData.daily_hours).sort();
    const sortedWeeklyKeys = Object.keys(hoursData.weekly_hours).sort();
    const sortedMonthlyKeys = Object.keys(hoursData.monthly_hours).sort();
  
    // Chart data
    const chartData = {
      daily: {
        labels: sortedDailyKeys,
        datasets: [
          {
            label: 'Daily Hours',
            data: sortedDailyKeys.map((key) => hoursData.daily_hours[key]),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
        ],
      },
      weekly: {
        labels: sortedWeeklyKeys,
        datasets: [
          {
            label: 'Weekly Hours',
            data: sortedWeeklyKeys.map((key) => hoursData.weekly_hours[key]),
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
          },
        ],
      },
      monthly: {
        labels: sortedMonthlyKeys,
        datasets: [
          {
            label: 'Monthly Hours',
            data: sortedMonthlyKeys.map((key) => hoursData.monthly_hours[key]),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },
        ],
      },
    };
  

  return (
    <div className="HoursCount" style={{ width: "60%", margin: "0 auto" }}>
    <p style={{ fontSize: "18px" }} align="center">Hours spent in the gym by day/week/month</p>
      <Form.Control
        as="select"
        value={selectedChart}
        onChange={(e) => setSelectedChart(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </Form.Control>

      <Bar data={chartData[selectedChart]} />
    </div>
  );
}

export default HoursCount;
