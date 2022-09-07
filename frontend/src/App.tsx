import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'

import Login from './features/auth/Login';
import { Counter } from './features/counter/Counter';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/">홈</Link><br/>
        <Link to="/login">로그인</Link><br/>
        <Link to="/counter">카운터</Link>
      </header>
      <Routes>
        <Route path="/" element={<p>홈</p> } />
        <Route path="/login" element={<Login />} />        
        <Route path="/counter" element={<Counter />} />        
      </Routes>
    </div>
  );
} 

export default App;
