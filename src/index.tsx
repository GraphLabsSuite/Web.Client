import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';
import {init} from "./lib/connector";
import {Promise} from 'bluebird';
global.Promise = Promise;
// @ts-ignore
import hostconfigJson from "../hostconfig.json"

init({
    hostBase: hostconfigJson.protocol + '://' + hostconfigJson.host + ':' + hostconfigJson.port + '/'
});

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
