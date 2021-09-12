import React, { useEffect } from 'react';
import { getUserInfo, getUser } from "../store/user";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
	const dispatch = useDispatch();
	const user = useSelector(getUser);
	const token = user?.token

	useEffect(() => {
		if (token)
			dispatch(getUserInfo())
	}, [dispatch, token])

	return (
		<div>
			Hello world
		</div>
	)
}
