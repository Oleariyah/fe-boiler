import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isEmpty } from "lodash";
import { loadState } from "../helpers/auth";
import { Header } from "../components";


const ProtectedRoute = ({ component: Component, render, ...rest }) => {

	return (
		<>
			<Header />
			<div className="container p-5">
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
			</div>
		</>
	)
};

export default ProtectedRoute;
