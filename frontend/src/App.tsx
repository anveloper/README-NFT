// core
import { useContext, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// state
import {
  login,
  selectIsSSAFY,
  selectUserAddress,
  setCurrentChainId,
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

// socket
import { SocketContext } from "socketConfig";
import {
  MSG,
  selectHostUserName,
  setAnswerLength,
  setIsSoleved,
  setMessages,
  setParticipants,
  setRoomCnt,
  setSolvers,
  setStarted,
} from "features/game/gameSlice";

function App() {
  const socket = useContext(SocketContext);
  const hostUserName = useAppSelector(selectHostUserName);
  const userAddress = useAppSelector(selectUserAddress);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const isGame = pathname.startsWith("/game");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //chain Id, account 변화 감지
  useEffect(() => {
    async function handleNewAccounts() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0].length > 0) {
        console.log("accountsChaged");
        dispatch(login(accounts[0]));
        window.location.reload();
      }
    }
    function handleChainChanged(chainId: any) {
      console.log("network changed");
      dispatch(setCurrentChainId(chainId));
      if (chainId === "0x79f5") {
        dispatch(setIsSSAFY(true));
      } else if (chainId === "0x5") {
        dispatch(setIsSSAFY(false));
      } else {
        dispatch(setIsSSAFY(false));
        dispatch(setIsWelcome(true));
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
  }, []);

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log(currentChainId);
        dispatch(setCurrentChainId(currentChainId));
      }
    };
    checkNetwork();
  }, []);

  useEffect(() => {
    socket.on("bye", (user: string, cnt: number, data: string) => {
      dispatch(setRoomCnt(cnt));
      dispatch(setParticipants(JSON.parse(data)));
      dispatch(
        setMessages(MSG("system", user, `[${user}]님이 퇴장하셨습니다.`))
      );
    });
    socket.on("welcome", (user: string, cnt: number, data: string) => {
      dispatch(setRoomCnt(cnt));
      dispatch(setParticipants(JSON.parse(data)));
      dispatch(
        setMessages(MSG("system", user, `[${user}]님이 입장하셨습니다.`))
      );
    });
    socket.on("new_message", (user: string, msg: string) => {
      dispatch(setMessages(MSG("other", user, msg)));
      // console.log("NewMessage", `${user}: ${msg}`);
    });
    socket.on("reset_answer", (cnt) => {
      socket.emit("reset_answer", hostUserName);
      dispatch(setAnswerLength(cnt));
      dispatch(setIsSoleved(false));
    });
    socket.on("solve_cnt", (solver, solversCnt, roomCnt) => {
      dispatch(setSolvers({ solver, solversCnt, roomCnt }));
    });
    socket.on("game_start", () => {
      dispatch(setStarted(true));
    });
    socket.on("host_leave", () => {
      socket.emit("leave_room", hostUserName);
      navigate("/live");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <Milestone>
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
