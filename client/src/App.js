import React, { Fragment } from 'react';
import MainPage from './components/MainPage';
import './App.css';
const App = () => {
  return (
    <Fragment>
      <MainPage msg="Hello" />
      <MainPage msg="Bye" />
    </Fragment>
  );
};
export default App;
