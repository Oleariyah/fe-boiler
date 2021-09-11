import React, { useRef, useEffect } from 'react'
import { Auth, Activation, ResetPassword } from "./pages";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { getAuthDetails } from "./store/auth";
import { getUser, getUserToken } from "./store/user";
import { useDispatch, useSelector } from "react-redux";
import './styles/App.css';

function App() {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const auth = useSelector(getAuthDetails);
  const user = useSelector(getUser);

  useEffect(() => {
    if (auth && auth.isLogged) {
      const firstLogin = localStorage.getItem("firstLogin");
      if (firstLogin) dispatch(getUserToken(null))
    }
  }, [auth, dispatch])

  return (
    <div className="container">
      <ToastContainer />
      <LoadingBar color='#0366d6' ref={ref} />
      <Switch>
        <Route exact path="/" render={() => <Auth />} />
        <Route exact path="/user/activate/:token" render={() => <Activation />} />
        <Route exact path="/user/reset/:token" render={() => <ResetPassword />} />
      </Switch>
    </div>
  );
}

export default App;
