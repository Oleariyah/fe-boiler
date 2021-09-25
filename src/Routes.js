import React, { lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./modules/ProtectedRoute";

const Activation = lazy(() => import('./pages/Activation'));
const Auth = lazy(() => import('./pages/Auth'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));

const Routers = () => {

	return (
		<Switch>
			<Route exact path="/" render={() => <Auth />} />
			<Route exact path="/activate/:token" render={() => <Activation />} />
			<Route exact path="/reset/:token" render={() => <ResetPassword />} />
			<ProtectedRoute exact path="/user" render={() => <Profile />} />
		</Switch>
	)
}

export default Routers;