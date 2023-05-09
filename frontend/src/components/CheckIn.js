import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';
import {Toast} from "react-bootstrap";

class CheckIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toast: false,
            email: "",
        }
    }

    changeEmail = (event) => {
        this.setState({
            email: event.target.value,
            toast: false,
        });
    }

    reset = (event) => {
        console.log("reset called")
        this.setState({
            toast: false,
            email: "",
        })

        console.log(event)
    }

     getId() {
         return new Promise((resolve, reject) => {
             fetch(
                 process.env.REACT_APP_BACKEND_URL+"/api/user/" + this.state.email, {
                     method: 'GET', headers: {
                         'Authorization': 'token ' + localStorage.getItem("token"), 'Content-Type': 'application/json'
                     },
                 }
             )
             .then(res => res.json())
             .then((result) => {
                 if (result.error !== undefined) {
                     reject(new Error(result.error))
                 } else {
                     resolve(result.id)
                 }
             })
             .catch((error) => {
                 reject(error)
             });
         })
    }

    handleCheckin = (e) => {
        e.preventDefault();
        this.getId().then(
            (id) => {
                this.doPost(id);
            }
        )
        .catch((error) => {
            this.setState({toast: true, message: "Unknown user"})
            })
        .finally(() => {
            e.target.form.reset()
        })
    }

    handleCheckout = (e) => {
        e.preventDefault();
        this.getId().then(
            (id) => {
                this.doPut(id);
            }
        ).catch((error) => {
            this.setState({toast: true, message: "Unknown user"})
        })
        .finally(() => {
            e.target.form.reset()
        })
    }

    doPut(id) {
        let location_id;
        try {
            let location= JSON.parse(localStorage.getItem('location'));
            location_id=location.location_id;
        }
        catch (err){
            this.setState({toast: true, message: "Select a location"})
            return
        }
        let data = {
            username: id,
            location_id: location_id,
        }

        fetch(
            process.env.REACT_APP_BACKEND_URL+"/api/checkout/", {method: 'PUT', headers: {
                    'Authorization': 'token ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'},
                body: JSON.stringify(data)}
        )
            .then(res => res.json())
            .then((result) => {
                if (result.error === undefined) {
                    this.setState({toast: true, message: "Check out successful"})
                } else {
                    this.setState({toast: true, message: result.error})
                }

            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({toast: true, message: "Check out failed"})
            });
    }

    doPost(id) {
        let location_id;
        try {
            let location= JSON.parse(localStorage.getItem('location'));
            location_id=location.location_id;
        }
        catch (err){
            this.setState({toast: true, message: "Select a location"})
            return
        }
        let data = {
            username: id,
            location_id: location_id,
        }

        fetch(
            process.env.REACT_APP_BACKEND_URL+"/api/checkin/", {method: 'POST', headers: {
                    'Authorization': 'token ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'},
                body: JSON.stringify(data)}
        )
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                if (result.error === undefined) {
                    this.setState({toast: true, message: "Check in successful"})
                } else {
                    this.setState({toast: true, message: result.error})
                }

            })
            .catch((error) => {
                this.setState({toast: true, message: "Check in failed"})
            });
    }

    render() {
        return (
            <Container className="d-flex justify-content-md-center mt-3">
                <Toast show={this.state.toast} onClose={this.reset}>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Message</strong>
                    </Toast.Header>
                    <Toast.Body>{this.state.message}</Toast.Body>
                </Toast>
                <Form style={{ width: '500px' }}>
                    <Form.Label>Customer e-mail</Form.Label>
                    <Form.Control type="text" onChange={this.changeEmail} placeholder="Enter customer e-mail" />
                    <br />

                    <Button onClick={this.handleCheckin} variant="primary" type="submit">
                        Check In
                    </Button> {' '}

                    <Button onClick={this.handleCheckout} variant="primary" type="submit">
                        Check Out
                    </Button>
                </Form>

            </Container>
        );
    }
}

export default CheckIn;