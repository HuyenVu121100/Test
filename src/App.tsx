import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import RandomUser from './Homepage/Homepage';
import UserDetail from './Homepage/UserDetail';

function App() {
  return (
    <>
    <div style={{width: "80%", margin:"0 auto"}}>
    <BrowserRouter>
      <Routes>
        <Route path="/user/:index" element={<UserDetail />} />
        <Route path="/" element={<RandomUser />} />
      </Routes>
    </BrowserRouter>
    </div>
    </>
    
  );
}

export default App;


