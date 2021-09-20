import React from 'react';
import { Modal, Button } from "react-bootstrap";

export default function ConfirmAction(props) {
	const { confirmationContent } = props;

	return (
		<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>

			<div className="p-3">
				<Modal.Body>
					<h4 className="mb-">{confirmationContent?.header}</h4>
					<p>
						{confirmationContent?.body}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.handler}>Yes, Go ahead.</Button>
					<Button variant="danger" onClick={props.onHide}>Close</Button>
				</Modal.Footer>
			</div>
		</Modal>
	)
}
