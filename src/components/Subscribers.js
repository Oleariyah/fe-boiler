import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";

export default function Subscribers() {
	const dispatch = useDispatch();
	const history = useHistory();
	const ref = useRef(null);



	return (
		<div className="card p-4" style={{ width: 510 }}>
			<Table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Role</th>
						<th scope="col">Acttions</th>
					</tr>
				</thead>
				<tbody>
					<tr className="py-5">
						<td>Mark</td>
						<td>Otto</td>
						<td >
							<DropdownButton
								id="dropdown-basic-button"
								title="Admin"
								variant="btn btn-outline-secondary"
							>
								<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
								<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
								<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
							</DropdownButton>
						</td>
					</tr>
					<tr>
						<td>Jacob</td>
						<td>Thornton</td>
						<td>@fat</td>
					</tr>
					<tr>
						<td colspan="2">Larry the Bird</td>
						<td>@twitter</td>
					</tr>
				</tbody>
			</Table>
		</div>
	)
}
