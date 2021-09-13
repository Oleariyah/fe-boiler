import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isEmpty } from "lodash";
import { loadState } from "../helpers/auth";


const ProtectedRoute = ({ component: Component, render, ...rest }) => {

	return (
		<Route
			{...rest}
			exact
			render={props => {
				if (isEmpty(loadState())) return <Redirect to={{
					pathname: "/",
					state: { from: props.location }
				}} />;
				return Component ? <Component  {...props} /> : render(props);
			}}
		/>
	)
};

export default ProtectedRoute;
