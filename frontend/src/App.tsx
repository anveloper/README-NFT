// core
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
// page
import Main from "./features/main/Main";
import LiveList from "./features/main/LiveList";
import NFTList from "./features/main/NFTList";
import Detail from "./features/detail/Detail";
import Welcome from "./features/welcome/Welcome";
import Login from "./features/auth/Login";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/">홈</Link>
        <Link to="/detail">NFT상세</Link>
        <Link to="/welcome">웰컴</Link>
        <Link to="/login">로그인</Link>
      </header>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="/live" element={<LiveList />} />
          <Route path="/list" element={<NFTList />} />
        </Route>
        <Route path="/detail" element={<Detail />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
