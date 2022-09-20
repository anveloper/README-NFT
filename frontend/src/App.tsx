// core
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// components
import Navbar from "./components/Navbar";
import BackgroundCloud from "./components/BackgroundCloud";
// page
import Main from "./features/main/Main";
import LiveList from "./features/main/LiveList";
import NFTList from "./features/main/NFTList";
import Detail from "./features/detail/NFTDetail";
import Sell from "./features/detail/NFTSell";
import Welcome from "./features/welcome/Welcome";
import Login from "./features/auth/Login";
import Game from "./features/game/Game";
import MyPage from "./features/mypage/MyPage";
// css
import styles from "./App.module.css";
import { useAppSelector } from "./app/hooks";
import { selectUserAddress } from "./features/auth/authSlice";
//testPage
import TestPage from "./testWeb3/TestPage";

function App() {
  const userAddress = useAppSelector(selectUserAddress);
  const { pathname } = useLocation();
  return (
    <div className={styles.container}>
      {userAddress ? (
        <div>
          <BackgroundCloud />
          {pathname.length < 16 && <Navbar />}
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Main />}>
                <Route index element={<LiveList />} />
                <Route path="/live" element={<LiveList />} />
                <Route path="/list" element={<NFTList />} />
              </Route>
              <Route path="/detail" element={<Detail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game/:roomName" element={<Game />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/test" element={<TestPage />} />
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
