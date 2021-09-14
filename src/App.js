import React, { useRef } from 'react'
import { Auth, Activation, ResetPassword, Profile } from "./pages";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import ProtectedRoute from "./modules/ProtectedRoute";
import './styles/App.css';

function App() {
  const ref = useRef(null);

  return (
    <div>
      <ToastContainer />
      <LoadingBar color='#0366d6' ref={ref} />
      <Switch>
        <Route exact path="/" render={() => <Auth />} />
        <Route exact path="/activate/:token" render={() => <Activation />} />
        <Route exact path="/reset/:token" render={() => <ResetPassword />} />
        <ProtectedRoute exact path="/user" render={() => <Profile />} />
      </Switch>
    </div>
  );
}

export default App;
