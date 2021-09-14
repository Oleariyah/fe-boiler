import React from 'react';
import { getUser } from "../store/user";
import { useSelector } from "react-redux";
import '../styles/Profile.css';

export default function Profile() {
	const user = useSelector(getUser);
	const { details } = user;

	return (
		<div className="d-flex justify-content-center align-items-center flex-column">
			<div className="text-center">
				<img alt="avatar" src={details?.avatar} className="avatar" />
				<div className="mt-3 greetings">Welcome! {details?.name}</div>
			</div>
			<div className="mt-4">
				<div className="row">
					<div className="card text-left m-3" style={{ width: 260 }}>
						<img className="card-img-top" src="holder.js/100px180/" alt="" />
						<div className="card-body">
							<h4 className="card-title">Account Details</h4>
							<p className="card-text">Select card to manage your account details.</p>
						</div>
					</div>
					<div className="card text-left m-3" style={{ width: 260 }}>
						<img className="card-img-top" src="holder.js/100px180/" alt="" />
						<div className="card-body">
							<h4 className="card-title">Subcribers</h4>
							<p className="card-text">Select card to manage view and manage your subscribers.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
