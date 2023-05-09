import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';


const style = {
  checkbox: {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    width: '20px',
    height: '20px',
    border: '2px solid #ccc',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
  },
  checkedCheckbox: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  disabledCheckbox: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  button: {
    backgroundColor: '#1e90ff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

const EnrollNonmembers = ({selectedLocation}) => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [myTrainingID, setmyTrainingID] = useState();
  const [myError, setmyError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  //const [location, setLocation] = useState('');

  useEffect(() => {
    console.log(selectedLocation);
    console.log(selectedLocation.location_id);
    const mylocation = selectedLocation.location_id;
  
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/viewtrainings/${mylocation}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${localStorage.getItem('token')}`,
        'Access-Control-Allow-Origin': '*'
      },
    })
      .then(response => {
        setTrainings(response.data);
     
      })
      .catch(error => {
     
      });
  }, [selectedLocation]);
  
  const handleTrainingSelect = (event) => {
    console.log('Checkbox clicked '+ event.target.value);
    const training_id = parseInt(event.target.value);
    setmyTrainingID(parseInt(event.target.value));
    if (event.target.checked) {
      setSelectedTrainings([training_id]);
    } else {
      setSelectedTrainings(selectedTrainings.filter(id => id !== training_id));
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    const data = { training_id: myTrainingID, username: userEmail };
    axios.post(process.env.REACT_APP_BACKEND_URL+'/api/signupnonmembers/', data, {
        headers: {
           'Content-Type': 'application/json',
           'Authorization' : `token ${localStorage.getItem('token')}`,
           "Access-Control-Allow-Origin": "*"
           
        }}
    )
    .then(response => {
      console.log(response.data);
      setmyError('');
      setSuccessMessage('User enrolled successfully!');

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000); 
    })
    .catch(error => {
      console.error(error.response.data);
      setSuccessMessage('');
      setmyError(error.response.data["error"]);

      setTimeout(() => {
        setmyError('');
      }, 2000); 
    });
};

return (
  <Container className="d-flex justify-content-md-center mt-3">
    <form style={{ width: '1200px' }} onSubmit={handleSubmit}>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Training Name</th>
          <th>Instructor Name </th>
          <th>Start Date & Time</th>
          <th>End Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {trainings.map((training) => {
          const trainingEndTime = new Date(training.end_time);
          if (trainingEndTime > new Date()) {
            return (
              <tr key={training.training_id}>
                <td>
                  <input
                    type="checkbox"
                    id={`training-${training.training_id}`}
                    value={training.training_id}
                    checked={selectedTrainings.includes(training.training_id)}
                    onChange={handleTrainingSelect}
                    style={
                      selectedTrainings.includes(training.training_id)
                        ? style.checkedCheckbox
                        : style.checkbox
                    }
                    className={
                      selectedTrainings.includes(training.training_id)
                        ? ''
                        : 'disabledCheckbox'
                    }
                  />
                </td>
                <td>{training.training_type}</td>
                <td>{training.instructor_name}</td>
                <td>{new Date(training.start_time).toLocaleString()}</td>
                <td>{trainingEndTime.toLocaleString()}</td>
              </tr>
            );
          }
          return null;
        })}
      </tbody>
    </table>
    <br/>
    <div align="center">
      <label htmlFor="user-email">User Email:</label>
      <input
        type="email"
        id="user-email"
        value={userEmail}
        onChange={(event) => setUserEmail(event.target.value)}
      />
    </div>
    <br/>
    {myError && <p style={{ color: 'red' }}>{myError}</p>}
    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    <div align="center">
    <button
      type="submit"
      disabled={selectedTrainings.length === 0}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        width: '200px' // added to resize the button
      }}
    >
      Enroll
    </button>
    </div>
  </form>
  </Container>
);
    }


export default EnrollNonmembers;