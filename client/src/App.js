import React, { Fragment, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Navbar from './components/layout/Navbar';
// import Landing from './components/layout/Landing';
// import Routes from './components/routing/Routes';
import MainPage from './components/MainPage';

// Redux
// import { Provider } from 'react-redux';
// import store from './store';
// import { loadUser } from './actions/auth';
// import setAuthToken from './utils/setAuthToken';

import './App.css';

// if (localStorage.token) {
//   setAuthToken(localStorage.token);
// }

const App = () => {
  return (
    <MainPage />
  );
};

export default App;
