// core
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Routes, Route, useLocation } from "react-router-dom";
// state
import {
  login,
  selectIsSSAFY,
  selectUserAddress,
  setIsSSAFY,
  setIsWelcome,
} from "./features/auth/authSlice";
// components
import Navbar from "./components/nav/Navbar";
import BackgroundCloud from "./components/BackgroundCloud";
// page
import Milestone from "routes/Milestone";
import DevRoute from "routes/DevRoute";
import Main from "./features/main/Main";
import Mint from "./features/mint/Mint";
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

import MetaMaskOnboarding from "@metamask/onboarding";
import NFTSale from "./features/nft/NftSaleList";
import MyMintList from "./features/mint/MyMintList";
import NetGuide from "routes/NetGuide";
import Tutorial from "features/tutorial/Tutorial";

function App() {
  const userAddress = useAppSelector(selectUserAddress);
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const [isSsafyNet, setIsSsafyNet] = useState<boolean>(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const isGame = pathname.startsWith("/game");
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function handleNewAccounts() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0].length > 0) {
        console.log("accountsChaged");
        dispatch(login(accounts[0]));
      }
    }
    function handleChainChanged(chainId: any) {
      console.log("network changed");
      if (chainId === "0x79f5") {
        dispatch(setIsSSAFY(true));
        setIsSsafyNet(!isSsafyNet);
      } else if (chainId === "0x5") {
        dispatch(setIsSSAFY(false));
      } else {
        dispatch(setIsWelcome());
        alert("goeril나 SSAFYNet을 사용해 주세요!");
      }
      window.location.reload();
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.on("accountsChanged", handleNewAccounts);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    return () => {
      window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(isSSAFY);
  }, [isSSAFY]);
  return (
    <div className={styles.container}>
      <Milestone isSsafyNet={isSsafyNet}>
        <>
          <BackgroundCloud />
          {!isGame && <Navbar mainRef={mainRef} />}
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Main mainRef={mainRef} />}>
                <Route index element={<LiveList />} />
                <Route path="/live" element={<LiveList />} />
                <Route path="/list" element={<NFTList />} />
              </Route>
              <Route path="/mint" element={<Mint />} />
              <Route path="/detail/:tokenId" element={<Detail />} />
              <Route
                path="/temp-list"
                element={<MyMintList account={userAddress} />}
              />
              <Route path="/sale" element={<NFTSale />} />

              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game/:roomName" element={<Game />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route
                path="/test"
                element={
                  <DevRoute>
                    <TestPage />
                  </DevRoute>
                }
              />
            </Routes>
          </div>
        </>
      </Milestone>
    </div>
  );
}

export default App;
