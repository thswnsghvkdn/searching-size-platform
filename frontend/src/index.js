import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './pages/index.js';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"

ReactDOM.render(
  // BrowserRouter로 감싸야 react-router-dom 사용가능
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.getElementById('root')
);


reportWebVitals();
