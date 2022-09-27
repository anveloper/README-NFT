// core
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Routes, Route, useLocation } from "react-router-dom";
// state
import { loginUser, selectUserAddress } from "./features/auth/authSlice";
// components
import Navbar from "./components/Navbar";
import BackgroundCloud from "./components/BackgroundCloud";
// page
import Main from "./features/main/Main";
import LiveList from "./features/main/LiveList";
import NFTList from "./features/main/NFTList";
import Detail from "./features/detail/NftDetail";
import Sell from "./features/detail/NftSell";
import Welcome from "./features/welcome/Welcome";
import Login from "./features/auth/Login";
import Game from "./features/game/Game";
import MyPage from "./features/mypage/MyPage";
// css
import styles from "./App.module.css";
//testPage

import TestPage from "./testWeb3/TestPage";

import MyPageTest from "./features/mypage/MyPageTest";
import NFTSale from "./features/nft/NftSaleList";
import Mint from "./features/mint/Mint";
import MyMintList from "./features/mint/MyMintList";

function App() {
  const userAddress = useAppSelector(selectUserAddress);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

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

        if (accounts[0].length > 0) {
          dispatch(loginUser(accounts[0]));
        }
      } else {
        dispatch(loginUser(`비회원 개발자 ${Math.floor(Math.random() * 19920722)}`));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

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
              <Route path="/mint" element={<Mint account={account} />} />
              <Route path="/detail/:tokenId" element={<Detail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/temp-list" element={<MyMintList account={account} />} />
              <Route path="/sale" element={<NFTSale />} />

              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game/:roomName" element={<Game />} />
              <Route path="/mypage" element={<MyPage account={account} />} />
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
