import React from 'react';
import { Form, Button, Spinner } from "react-bootstrap";
import { activateAccount, getAuthDetails } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";
import { useParams, Link } from "react-router-dom";

export default function Activation() {
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(getAuthDetails);

    const { token } = useParams();
    const data = jwt.decode(token);
    const { name } = data;
    const { loading } = auth;

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(activateAccount({ activation_token: token, history }));
    }

    console.log("auth")
    return (
        <Form noValidate onSubmit={handleSubmit}>
            <div className="container" style={{ width: "50%" }}>
                <div className="m-5 p-5">
                    <div className="my-5">
                        <h3>{`Welcome ${name}!`}</h3>
                        <h6>You are a step away from seting up your account.</h6>
                    </div>
                    <div className="d-flex flex-grow-2">
                        <Button
                            className="mt-2 mb-4 py-2 btn-block"
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                            <span className="ml-2">Activate Your Acoount</span>
                        </Button>
                    </div>
                    <div className="my-3">
                        <hr />
                    </div>
                    <Link variant="light" className="btn-block" to="/">
                        Go to Login
                    </Link>
                </div>
            </div>
        </Form>
    )
}
