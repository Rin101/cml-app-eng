import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App'
import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import { AppEng } from './eng/App_eng';

const AppWrapper = () => {
  return (
    <div className='App'>
      <BrowserRouter basename='/cml-app'>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/eng" element={<AppEng />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);
