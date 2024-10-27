import React from 'react';

import './index.css';
import reportWebVitals from './reportWebVitals';
import * as ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import {api_url} from "./api";
axios.defaults.baseURL = api_url
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);
reportWebVitals();

