import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadProgressBar } from 'axios-progress-bar';
import { Provider } from 'react-redux';
import * as Sentry from "@sentry/react";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/configureStore';
import { Integrations } from "@sentry/tracing";
import 'bootstrap/dist/css/bootstrap.min.css';
import "axios-progress-bar/dist/nprogress.css";
import 'react-toastify/dist/ReactToastify.css';

Sentry.init({
  dsn: "https://b263bd0f945146ceaebcec93245c260c@o555833.ingest.sentry.io/5685976",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

loadProgressBar();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>,
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
