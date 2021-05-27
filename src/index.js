import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import * as Sentry from "@sentry/electron"

//Sentry.init({ dsn: "https://ce256aa1647a41c9b5c3370648afa0e5@o630765.ingest.sentry.io/5755236" });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
