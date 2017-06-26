import React from 'react';
import NavBar from './navbar/navbar';

const App = ({ children }) => {
  return (
    <div className="app">
      <NavBar />
      { children }
    </div>
  );
};

export default App;
