import React from 'react';
import ReactDOM from 'react-dom';
import { AppEng } from './eng/App_eng';

const AppWrapper = () => {
  return (
    <div className='App'>
      <AppEng />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);
