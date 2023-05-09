import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';
import {Toast} from "react-bootstrap";

class Membership extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toast: false,
            email: ""
        }
    }

    changeEmail = (event) => {
        this.setState({
            email: event.target.value,
            toast: false,
        });
    }

    reset = (event) => {
        this.setState({
            toast: false,
            id: "",
        })
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

    handleUpdate = (e) => {
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
        fetch(
            process.env.REACT_APP_BACKEND_URL+"/api/updateMembership/" + id, {method: 'PUT', headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token")},
                }
        )
            .then(res => res.json())
            .then((result) => {
                if (result.error === undefined) {
                    this.setState({toast: true, message: "Upgrade successful"})
                } else {
                    this.setState({toast: true, message: result.error})
                }

            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({toast: true, message: "Upgrade failed"})
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

                    <Button onClick={this.handleUpdate} variant="primary" type="submit">
                        Upgrade Membership
                    </Button> {' '}
                </Form>

            </Container>
        );
    }
}

export default Membership;