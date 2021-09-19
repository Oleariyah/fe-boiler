import React, { useEffect, useState } from "react";
import { getUser, updateUserInfo, getUserInfo, updateUserAvatar, changeUserPassword } from "../store/user";
import { useDispatch, useSelector } from "react-redux";
import validate from "../utils/validate.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { popover } from "../helpers/password_guides";
import { Form, Button, Spinner, OverlayTrigger } from "react-bootstrap";
import '../styles/Profile.css';

export default function Profile() {
	const user = useSelector(getUser);
	const dispatch = useDispatch();
	const { details, loading } = user;

	const [value, setValue] = useState(details);
	const [validated, setValidated] = useState();
	const [password, setPassword] = useState();
	const [toReset, setToReset] = useState(false);
	const [isDisabled, setDisable] = useState(true);

	useEffect(() => {
		setValue(details)
	}, [details])

	useEffect(() => {
		dispatch(getUserInfo())
	}, [dispatch])

	const handleValue = (e) => {
		setValue({ ...value, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const form = e.currentTarget;
		if (form.checkValidity() === true) {
			const { password, confirmPassword } = value;
			const isConfirmed = password === confirmPassword;

			if (!isDisabled && !toReset) {
				setValidated(false);
				dispatch(updateUserInfo(value));
			}

			if (!isDisabled && toReset) {
				if (isConfirmed) {
					setValidated(false);
					dispatch(changeUserPassword(value));
				} else {
					toast.error("Oops! The provided passwords do not match the confirmed password.")
				}
			}
		}
	}

	const changeAvatar = (e) => {
		e.preventDefault();
		const file = e.target.files[0];

		if (!file)
			return toast.error("No file was uploaded.");
		if (file.size > 1024 * 1024)
			return toast.error("File size is too large.");
		if (file.type === "image/jpeg" && file.type === "image/png")
			return toast.error("File format is incorrect.");

		let formData = new FormData();
		formData.set("file", file)
		dispatch(updateUserAvatar({ data: formData, type: "multipart/form-data" }));
		setDisable(false);
		setToReset(false)
	}

	return (
		<div className="d-flex justify-content-center align-items-center flex-column">
			<div className="card p-4" style={{ width: 500 }}>
				<div className="text-center">
					<div className="profile-img">
						<img alt="avatar" src={details?.avatar} className="avatar" />
						<span>
							<FontAwesomeIcon icon={faCamera} size="sm" color="grey" />
							<p>Change</p>
							<input type="file" name="file" id="file_up" onChange={changeAvatar} />
						</span>
					</div>
					<div className="mt-3 greetings">Welcome! {details?.name}</div>
				</div>
			</div>
			<div>
				<div className="card text-left m-3 py-3" style={{ width: 500 }}>
					<img className="card-img-top" src="holder.js/100px180/" alt="" />
					<div className="card-body">
						{<div className="mb-4 d-flex flex-row align-items-baseline">
							<h5 className="card-title mr-2">{details?.role === "admin"
								? "Admin Details"
								: isDisabled ? "User Details" : "Edit Details"
							}</h5>
							<div
								style={{ cursor: "pointer" }}
								onClick={() => {
									setDisable(!isDisabled);
									setToReset(false)
								}}>
								{isDisabled
									? <FontAwesomeIcon icon={faPen} size="sm" color="grey" />
									: <FontAwesomeIcon icon={faTimes} size="sm" color="grey" />
								}
							</div>
						</div>}
						<Form noValidate validated={validated} onSubmit={handleSubmit}>
							{!toReset && < Form.Group controlId="validationCustom01">
								<Form.Label>Full Name</Form.Label>
								<Form.Control
									name="name"
									defaultValue={value?.name}
									pattern={validate.name}
									onChange={e => handleValue(e)}
									type="text"
									className="profile py-4"
									required
									disabled={isDisabled}
								/>
								<Form.Control.Feedback type="invalid">
									Please provide a name.
								</Form.Control.Feedback>
							</Form.Group>
							}
							{isDisabled && <Form.Group controlId="validationCustom02">
								<Form.Label>Email Address</Form.Label>
								<Form.Control
									name="email"
									defaultValue={value?.email}
									type="email"
									className="py-4"
									required
									disabled
								/>
								<Form.Control.Feedback type="invalid">
									Please provide a valid email address.
								</Form.Control.Feedback>
							</Form.Group>
							}
							{!isDisabled && toReset && <Form.Group controlId="validationCustom04">
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
										disabled={isDisabled}
									/>
								</OverlayTrigger>
								<Form.Control.Feedback type="invalid">
									Please provide a valid password.
								</Form.Control.Feedback>
							</Form.Group>
							}
							{!isDisabled && toReset && <Form.Group controlId="validationCustom05">
								<Form.Label>Confirm New Password</Form.Label>
								<Form.Control
									name="confirmPassword"
									onChange={e => handleValue(e)}
									type="password"
									className="profile py-4"
									minLength={8}
									pattern={validate.password}
									required
									disabled={isDisabled}
								/>
								<Form.Control.Feedback type="invalid">
									Please provide a valid password.
								</Form.Control.Feedback>
							</Form.Group>
							}
							{!isDisabled && (
								<div className="d-flex flex-row justify-content-between">
									<div className="d-flex flex-grow-2">
										<Button
											className="mt-2 mb-4 mr-1 btn-block"
											variant="btn btn-outline-secondary"
											onClick={() => setToReset(!toReset)}
										>
											{toReset ? "Reset Password" : "Update Profile"}
										</Button>
									</div>
									<div className="d-flex flex-grow-1">
										<Button
											className="mt-2 mb-4 py-2 btn-block"
											type="submit"
											variant="primary"
											disabled={loading}
										>
											{loading && <Spinner
												as="span"
												animation="border"
												size="sm"
												role="status"
												aria-hidden="true"
											/>}
											<span className="ml-2">Submit</span>
										</Button>
									</div>
								</div>
							)}
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}
