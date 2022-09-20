// core
import React, { useEffect, useState } from "react";
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
import NFTLists from "./features/detail/NFTLists/NFTLists";
import MyPageTest from "./features/mypage/MyPageTest";
import NFTSaleTest from "./features/detail/SaleAnimal";

function App() {
  const userAddress = useAppSelector(selectUserAddress);
  const { pathname } = useLocation();

  // (정현) 임의로 메타마스크 로그인 유저 계정 정보 가져오는 함수. 차후 삭제 예정
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // console.log(accounts[0]);
        setAccount(accounts[0]);
      } else {
        alert("install metamask.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccount();
  }, [account]);
  // (정현) 여기까지

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
              <Route path="/temp-list" element={<MyPageTest account={account} />} />
              <Route path="/temp-sell" element={<NFTSaleTest account={account} />} />

              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game/:roomName" element={<Game />} />
              <Route path="/mypage" element={<MyPage />} />
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
