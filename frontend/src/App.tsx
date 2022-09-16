// core
import React from "react";
import { Routes, Route } from "react-router-dom";
// components
import Navbar from "./components/Navbar";
import BackgroundCloud from "./components/BackgroundCloud";
// page
import Main from "./features/main/Main";
import LiveList from "./features/main/LiveList";
import NFTList from "./features/main/NFTList";
import Detail from "./features/detail/Detail";
import Welcome from "./features/welcome/Welcome";
import Login from "./features/auth/Login";
// css
import styles from "./App.module.css";
import { useAppSelector } from "./app/hooks";
import { selectUserAddress } from "./features/auth/authSlice";

function App() {
  const userAddress = useAppSelector(selectUserAddress);

  return (
    <div className={styles.container}>
      {userAddress ? (
        <div>
          <BackgroundCloud />
          <Navbar />
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Main />}>
                <Route element={<LiveList />} />
                <Route path="/live" element={<LiveList />} />
                <Route path="/list" element={<NFTList />} />
              </Route>
              <Route path="/detail" element={<Detail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game/:roomName" element={<p></p>}/>
            </Routes>
          </div>
        </div>
      ) : (
        <Welcome />
      )}
    </div>
  );
}

export default App;
