import React from 'react';
import NavBar from './navbar/navbar';

const App = ({ children }) => {
  return (
    <div className="app">
      Test
      <NavBar />
      { children }
    </div>
  );
};

export default App;
