import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Modal, Button } from 'react-bootstrap';

const ViewActivities = () => {
    const [data, setData] = useState([]);
    const [options, setOptions] = useState({
        key: '90_days',
        label: '90 Days'
    });
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
        };
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getActivityLog/?options=${options.key}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Oops! Something went wrong');
                }
            })
            .then((json) => setData(json.logs))
            .catch(() => setShowErrorModal(true));
    }, [options]);

    const handleOptionsSelect = (eventKey, event) => {
        setOptions({
            key: eventKey,
            label: event.target.innerText
        });
    };

    const handleCloseErrorModal = () => setShowErrorModal(false);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <>
            <br/>
            <br/>
            <Dropdown onSelect={handleOptionsSelect}>
                Select Time Range: {' '}
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {options.label}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="90_days">90 Days</Dropdown.Item>
                    <Dropdown.Item eventKey="week">1 Week</Dropdown.Item>
                    <Dropdown.Item eventKey="month">1 Month</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <br/>
            <br/>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Activity</th>
                    <th>Duration (minutes)</th>
                    <th>Calories Burned</th>
                    <th>Timestamp</th>
                    <th>Distance (km)</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.timestamp}>
                        <td>{item.activity}</td>
                        <td>{item.duration}</td>
                        <td>{item.calories}</td>
                        <td>{formatTimestamp(item.timestamp)}</td>
                        <td>{item.distance}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Something went wrong</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    An error occurred while fetching data from the API.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseErrorModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ViewActivities;
