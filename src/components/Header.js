import React from 'react';
import { logoutUser, resetAuth } from "../store/auth";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Header() {
	const dispatch = useDispatch();
	const history = useHistory();

	const logOut = (e) => {
		e.preventDefault();
		dispatch(logoutUser())
		dispatch(resetAuth())
		history.push("/")
	}

	return (
		<div className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<div className="navbar-brand mb-0 h1">User Management App</div>
				<div className="form-inline">
					<button onClick={logOut} className="btn btn-outline-danger my-2 my-sm-0">Logout</button>
				</div>
			</div>
		</div>
	)
}
