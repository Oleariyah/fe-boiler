import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Spinner, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { popover } from "../helpers/password_guides";
import validate from "../utils/validate.json";
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {
    getUserToken,
    loginUser,
    registerUser,
    resetPassword,
    getAuthDetails,
    loginWithGoogle,
    loginWithFacebook,
    resetAuth
} from "../store/auth";
import '../styles/Auth.css';

export default function Auth(props) {
    const dispatch = useDispatch();
    const auth = useSelector(getAuthDetails);
    const history = useHistory();

    const { loading } = auth;

    const [toLogin, setToLogin] = useState(true);
    const [forgotPassowrd, setForgotPassword] = useState(false);
    const [password, setPassword] = useState();
    const [value, setValue] = useState();
    const [validated, setValidated] = useState();

    const handleValue = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        dispatch(resetAuth())
    }, [dispatch])

    useEffect(() => {
        if (auth?.isLogged) {
            dispatch(getUserToken(null))
        }
    }, [auth?.isLogged, dispatch])

    useEffect(() => {
        if (auth?.token !== "") {
            history.push("/user")
        }
    }, [auth?.token, dispatch, history])

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            const { password, confirmPassword } = value;
            const isConfirmed = password === confirmPassword;

            if (!toLogin && !forgotPassowrd) {
                if (isConfirmed) {
                    setValidated(false);
                    dispatch(registerUser(value));
                } else {
                    toast.error("Oops! The provided passwords do not match the confirmed password.")
                }
            }

            if (toLogin && !forgotPassowrd) {
                setValidated(false);
                dispatch(loginUser(value));
            }

            if (forgotPassowrd) {
                setValidated(false);
                dispatch(resetPassword(value));
            }

        } else {
            setValidated(true);
            toast.info("Please fill the fields")
        }
    }

    const responseGoogle = (response) => {
        if (response?.tokenId)
            dispatch(loginWithGoogle(response.tokenId))
    }

    const responseFacebook = response => {
        if (response?.userID)
            dispatch(loginWithFacebook(response.userID, response.accessToken))
    };

    return (

        <div className="container">
            <div className="d-flex justify-content-center">
                <div className="container m-5 p-5" style={{ width: "50%" }}>
                    <h3 className="header mx-auto text-center p-2"> {forgotPassowrd ? "Forgot Password" : !toLogin ? "Create Account" : "Login"}</h3>
                    <div className="container py-3">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            {!toLogin && !forgotPassowrd && <Form.Group controlId="validationCustom01">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    pattern={validate.name}
                                    onChange={e => handleValue(e)}
                                    type="text"
                                    className="py-4"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a name.
                                </Form.Control.Feedback>
                            </Form.Group>
                            }
                            {!forgotPassowrd && <Form.Group controlId="validationCustom02">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    name="email"
                                    onChange={e => handleValue(e)}
                                    type="email"
                                    className="py-4"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid email address.
                                </Form.Control.Feedback>
                            </Form.Group>}
                            {forgotPassowrd && <Form.Group controlId="validationCustom02">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    name="email"
                                    onChange={e => handleValue(e)}
                                    type="email"
                                    className="py-4"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid email address.
                                </Form.Control.Feedback>
                            </Form.Group>}
                            {toLogin && !forgotPassowrd && <Form.Group controlId="validationCustom04">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    minLength={8}
                                    onChange={e => {
                                        setPassword(e.target.value)
                                        handleValue(e)
                                    }}
                                    type="password"
                                    className="py-4"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid password.
                                </Form.Control.Feedback>
                            </Form.Group>
                            }
                            {!toLogin && !forgotPassowrd && <Form.Group controlId="validationCustom04">
                                <Form.Label>Password</Form.Label>
                                <OverlayTrigger
                                    trigger="focus"
                                    placement="right"
                                    overlay={popover(password)}
                                >
                                    <Form.Control
                                        name="password"
                                        minLength={8}
                                        onChange={e => {
                                            setPassword(e.target.value)
                                            handleValue(e)
                                        }}
                                        pattern={validate.password}
                                        type="password"
                                        className="py-4"
                                        required
                                    />
                                </OverlayTrigger>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid password.
                                </Form.Control.Feedback>
                            </Form.Group>
                            }
                            {!toLogin && !forgotPassowrd && <Form.Group controlId="validationCustom05">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    name="confirmPassword"
                                    onChange={e => handleValue(e)}
                                    type="password"
                                    className="py-4"
                                    minLength={8}
                                    pattern={validate.password}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid password.
                                </Form.Control.Feedback>
                            </Form.Group>
                            }
                            <div className="d-flex flex-row justify-content-between">
                                {!forgotPassowrd &&
                                    <div className="d-flex flex-grow-2">
                                        <Button
                                            className="mt-2 mb-4 mr-1 btn-block"
                                            variant="btn btn-outline-secondary"
                                            onClick={() => setToLogin(!toLogin)}
                                        >
                                            {toLogin ? "Sign Up" : "Login"}
                                        </Button>
                                    </div>}
                                {!toLogin && !forgotPassowrd && <div className="d-flex flex-grow-1">
                                    <Button
                                        className="mt-2 mb-4 py-2 btn-block"
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        ) : (<FontAwesomeIcon
                                            icon={faUser}
                                            size="sm"
                                        />)}
                                        <span className="ml-2">Create Account</span>
                                    </Button>
                                </div>
                                }
                                {toLogin && !forgotPassowrd && <div className="d-flex flex-grow-1">
                                    <Button
                                        className="mt-2 mb-4 py-2 btn-block"
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        ) : (<FontAwesomeIcon
                                            icon={faLock}
                                            size="sm"
                                        />)}
                                        <span className="ml-2">Login</span>
                                    </Button>
                                </div>
                                }
                                {forgotPassowrd && (
                                    <Button
                                        className="mt-2 mb-4 py-2 btn-block"
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                    >
                                        Submit
                                    </Button>
                                )}
                            </div>
                            <div className="my-3">
                                <hr />
                            </div>
                            <div className="d-flex flex-row justify-content-between">
                                <span className="text-muted mt-2">Or login with:
                                    <span className="mx-2">
                                        <FacebookLogin
                                            appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                                            autoLoad={false}
                                            callback={responseFacebook}
                                            render={renderProps => (
                                                <span className="btn btn-link p-0" onClick={renderProps.onClick}>Facebook</span >
                                            )}
                                        />
                                    </span>
                                    <span>
                                        <GoogleLogin
                                            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                                            render={renderProps => (
                                                <span className="btn btn-link p-0" onClick={renderProps.onClick} disabled={renderProps.disabled}>Google</span >
                                            )}
                                            buttonText="Login"
                                            onSuccess={responseGoogle}
                                            onFailure={responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </span>
                                </span>
                                <Button variant="link" onClick={() => setForgotPassword(!forgotPassowrd)}>
                                    {!forgotPassowrd ? "Forgot Password?" : "Switch Back?"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
