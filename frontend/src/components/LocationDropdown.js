import React, { useState, useEffect } from 'react';

import styles from './LocationDropdown.module.css';

function LocationDropdown({ asDropdown }) {
  const defaultLocationId = 1;
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocationId);
  const [trainings, setTrainings] = useState([]);

  console.log("URI: " + process.env.REACT_APP_BACKEND_URL)
  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL+'/api/locations/')
      .then(response => response.json())
      .then(data => setLocations(data));
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/viewtrainings/${selectedLocation}`)
        .then(response => response.json())
        .then(data => setTrainings(data));
    } else {
      setTrainings([]);
    }
  }, [selectedLocation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSelectChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  if (asDropdown) {
    return (
      <div>
        <select value={selectedLocation} onChange={handleSelectChange} className={styles.dropdown}>
          <option value="">Select Location to see classes available</option>
          {locations.map(location => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
        {selectedLocation && selectedLocation !== "" && trainings.length > 0 ?
          <table className={styles.table} >
            <thead>
              <tr>
                <th>Instructor Name</th>
                <th>Training Type</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Current Capacity</th>
              </tr>
            </thead>
            <tbody>
            {trainings.filter((training) => new Date(training.end_time) > new Date()).map((training) => (
                <tr key={training.training_id}>
                  <td>{training.instructor_name}</td>
                  <td>{training.training_type}</td>
                  <td>{formatDate(training.start_time)}</td>
                  <td>{formatDate(training.end_time)}</td>
                  <td>{training.current_capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          :
          <p style={{ fontStyle: "italic", fontWeight: "bold" }}>{selectedLocation && selectedLocation !== "" ? "Currently no classes offered at this location!!" : ""}</p>
        }
      </div>
    );
  } else {
    return (
      <></>
    );
  }
}

export default LocationDropdown;
