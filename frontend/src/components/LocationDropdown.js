import React, { useState, useEffect } from 'react';

import styles from './LocationDropdown.module.css';
function LocationDropdown({ asDropdown }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/locations/')
      .then(response => response.json())
      .then(data => setLocations(data));
  }, []);

  const handleSelectChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  if (asDropdown) {
    return (
      <select value={selectedLocation} onChange={handleSelectChange} className={styles.dropdown} >
        <option value="">Select a location</option>
        {locations.map(location => (
          <option key={location.location_id} value={location.location_id}>
            {location.location_name}, {location.location_address}
          </option>
        ))}
      </select>
    );
  } else {
    return (
      <div className={styles.container}>
        {locations.map(location => (
          <option key={location.location_id} value={location.location_id}>
            {location.location_name}, {location.location_address}
          </option>
        ))}
      </div>
    );
  }
}

export default LocationDropdown;
