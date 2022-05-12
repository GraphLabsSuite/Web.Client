import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';
import {init} from "./lib/connector";
import {Promise} from 'bluebird';
global.Promise = Promise;

// Default server URL (mostly useful while development)
let serverUrl: string = "http://gl-backend.svtz.ru:5000/";
if ("REACT_APP_SERVER_PROTOCOL" in process.env && "REACT_APP_SERVER_HOST" in process.env && "REACT_APP_SERVER_PORT" in process.env) {
    serverUrl = process.env.REACT_APP_SERVER_PROTOCOL + '://' + process.env.REACT_APP_SERVER_HOST + ':' + process.env.REACT_APP_SERVER_PORT + '/';
}

init({
    hostBase: serverUrl
});

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
