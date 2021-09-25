import React, { useRef, Suspense } from 'react';
import { ToastContainer } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import Routers from './Routes';
import './styles/App.css';


function App() {
  const ref = useRef(null);

  return (
    <div>
      <ToastContainer />
      <LoadingBar color='#0366d6' ref={ref} />
      <Suspense fallback={
        <div>
          Loading...
        </div>}>
        <Routers />
      </Suspense>
    </div>
  );
}

export default App;
