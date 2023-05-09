import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Alert } from 'react-bootstrap';

function EquipmentChart({ locationId }) {
  const [activityTypes, setActivityTypes] = useState([]);

  useEffect(() => {
  async function fetchActivityTypes() {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/equipmenttypes/${locationId}`, {
                             headers: {
                                'Content-Type': 'application/json',
                                'Authorization' : `token ${localStorage.getItem('token')}`,
                                "Access-Control-Allow-Origin": "*"

                             }
                            });

      console.log(data)
      setActivityTypes(data);

    } catch (error) {
      console.error(error);
      setActivityTypes([]);
    }
  }
  fetchActivityTypes();
}, [locationId]);


  const chartData = {
    labels: activityTypes.map(type => type.type),
    datasets: [
      {
        label: 'Equipment Usage',
        data: activityTypes.map(type => type.count),
        backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        ],
        borderWidth: 2,
      }
    ],
  };

return (
  <div style={{width: '850px', height: '365px', margin: '0 auto'}}>
  <p style={{fontSize: '22px'}} align="center">Equipment Usage Statistics</p>
    {activityTypes.length > 0 && <Bar data={chartData} />}
    {activityTypes.length === 0 && (
      <Alert variant="info" className="text-center">
        Equipment Usage Statistics is currently unavailable at this Location
      </Alert>
    )}
  </div>
);

}

export default EquipmentChart;
