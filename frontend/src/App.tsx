// core
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Routes, Route, useLocation } from "react-router-dom";
// state
import { login, selectUserAddress } from "./features/auth/authSlice";
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

function App() {
  const userAddress = useAppSelector(selectUserAddress);
  const { pathname } = useLocation();
  const isGame = pathname.startsWith("/game");
  const dispatch = useAppDispatch();
  const [isSsafyNet, setIsSsafyNet] = useState<boolean>(false);
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
      if (chainId !== "0x79f5") {
        window.location.reload();
      } else {
        setIsSsafyNet(!isSsafyNet);
      }
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

  const [mainNav, setMainNav] = useState<number>(1);
  const [mainRef, setMainRef] = useState<HTMLDivElement[]>([]);
  return (
    <div className={styles.container}>
      <Milestone isSsafyNet={isSsafyNet}>
        <>
          <BackgroundCloud />
          {!isGame && <Navbar mainNav={mainNav} mainRef={mainRef} />}
          <div className={styles.content}>
            <Routes>
              <Route
                path="/"
                element={
                  <Main setMainNav={setMainNav} setMainRef={setMainRef} />
                }
              >
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
              <Route
                path="/mypage"
                element={<MyPage account={userAddress} />}
              />
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
