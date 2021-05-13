import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import App from './layouts/App';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  // process.env.NODE_ENV === 'production' ? 'https://buyma-backend.herokuapp.com' : 'http://localhost:3095';
  process.env.NODE_ENV === 'production' ? 'https://buyma-backend.herokuapp.com' : 'https://buyma-backend.herokuapp.com';
console.log('env', process.env.NODE_ENV === 'production');
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
