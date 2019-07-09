
import React from 'react';

import ReactDOM from 'react-dom';

import './index.css';

import Parent from './App';

import 'paper-css/paper.css';

import { HashRouter } from 'react-router-dom';








ReactDOM.render(<HashRouter><Parent/></HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

