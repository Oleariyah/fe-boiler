import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, getAllSubcribersInfo, updateUserRole, deleteUser } from "../store/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmAction from "./ConfirmAction";
import { Button } from "react-bootstrap";

export default function Subscribers() {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(getUser);
	const { subscribers, loading } = user;

	const [show, setShow] = useState(false);
	const [selected, setSelected] = useState(null);
	const [type, setType] = useState();
	const [confirmationContent, setContent] = useState(null);

	useEffect(() => {
		dispatch(getAllSubcribersInfo(history))
	}, [dispatch, history])

	const handleSubmit = () => {
		setShow(false)
		if (type === "update")
			dispatch(updateUserRole({
				value: selected.role === "sub-admin" ? "subscriber" : "sub-admin",
				id: selected._id,
				history
			}))

		if (type === "delete")
			dispatch(deleteUser({
				id: selected._id,
				history
			}))
	}

	return (
		<>
			<div className="card p-4" style={{ width: 510 }}>
				<div className="d-flex justify-content-end mb-2" style={{ fontWeight: 400 }}>Actions</div>
				{subscribers.length > 0 && subscribers.map((data, id) => (
					<div key={id} className="mb-2">
						<div className="d-flex flex-row justify-content-between align-items-center">
							<img src={data.avatar} alt="avatar" height="50" style={{ borderRadius: "50%" }} className="mr-3" />
							<div className="d-flex flex-grow-1">
								<div>
									<div className="text-bold">{data.name}</div>
									<h6 className="text-muted text-italics">{data.role}</h6>
								</div>
							</div>
							<div></div>
							{data.role !== "admin" && <div>
								<Button
									variant="light"
									style={{ borderRadius: "50%", width: 40, height: 40 }}
									className="mr-1"
									disabled={loading}
									onClick={() => {
										setShow(true);
										setContent({
											header: "Update a user role?",
											body: `This user will update the user role to "${data.role === "sub-admin"
												? "subscriber"
												: "sub-admin"
												}".`
										})
										setSelected(data)
										setType("update")
									}}
								>
									<FontAwesomeIcon icon={faUserLock} size="sm" />
								</Button>
								<Button
									variant="light"
									style={{ borderRadius: "50%", width: 40, height: 40 }}
									disabled={loading}
									onClick={() => {
										setShow(true);
										setContent({
											header: "Delete user from list?",
											body: `This user will be deleted from the subscriber list.`
										})
										setSelected(data)
										setType("delete")
									}}
								>
									<FontAwesomeIcon icon={faTrash} size="sm" color="red" />
								</Button>
							</div>}
						</div>
						{subscribers[subscribers.length - 1]._id !== data._id && <hr />}
					</div>
				))
				}
				{subscribers.length === 0 && "No Subscriber"}
			</div>
			<ConfirmAction
				onHide={() => setShow(false)}
				handler={() => handleSubmit()}
				{...{ show, selected, confirmationContent }}
			/>
		</>
	)
}
