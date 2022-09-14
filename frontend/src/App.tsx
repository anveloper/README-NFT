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
// css
import styles from "./App.module.css";
import Navbar from "./components/Navbar";
import BackgroundCloud from "./components/BackgroundCloud";

function App() {
  return (
    <div className={styles.container}>
      <BackgroundCloud />
      <Navbar />
      <div className={styles.content}>
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
    </div>
  );
}

export default App;
