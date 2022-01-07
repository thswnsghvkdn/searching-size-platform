import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './pages/index.js';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"

ReactDOM.render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.getElementById('root')
);


reportWebVitals();
