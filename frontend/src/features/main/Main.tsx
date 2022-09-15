// core
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { io } from "socket.io-client";
// state
import { selectSocket, setSocket } from "../game/gameSlice";
// component
import NewHelmet from "../../components/NewHelmet";
import Carousel from "./Carousel";
import MainTab from "./components/MainTab";
// css
import styles from "./Main.module.css";

const socketURL = "http://localhost:5000";

const Main = () => {
  const socket = useAppSelector(selectSocket);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!socket) {
      dispatch(setSocket(io(socketURL)));
      navigate("/live");
    } else {
      console.log("연결된 소켓 정보", socket);
    }
  }, [dispatch, navigate, socket]);

  return (
    <div className={styles.mainContainer}>
      <NewHelmet
        title="목록"
        description="README 게임 라이브 목록 및 NFT 목록이 나타납니다."
      />
      <Carousel />
      <div>{socket && <p>{socket.id}</p>}</div>
      <MainTab />
      <Outlet />
    </div>
  );
};

export default Main;
