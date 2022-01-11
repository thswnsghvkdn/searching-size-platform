import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './pages/index.js';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
import { AppProvider } from "./store"

ReactDOM.render(
  // BrowserRouter로 감싸야 react-router-dom 사용가능
  <BrowserRouter>
  {/*  컨텍스트를 사용하기 위해 AppLayout 컴포넌트로 감싼다  */}
    <AppProvider>
      <Root />
    </AppProvider>
  </BrowserRouter>,
  document.getElementById('root')
);


reportWebVitals();
