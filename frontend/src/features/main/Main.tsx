// core
import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { io } from "socket.io-client";
// state
import { selectSocket, setSocket } from "../game/gameSlice";
// component
import NewHelmet from "../../components/NewHelmet";
import Carousel from "./Carousel";
// css
import styles from "./Main.module.css";

const socketURL = "http://localhost:5000";

const Main = () => {
  const socket = useAppSelector(selectSocket);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) {
      dispatch(setSocket(io(socketURL)));
    } else {
      console.log("연결된 소켓 정보", socket);
    }
  }, [dispatch, socket]);

  return (
    <div className={styles.mainContainer}>
      <NewHelmet
        title="목록"
        description="README 게임 라이브 목록 및 NFT 목록이 나타납니다."
      />
      <div>{socket && <p>{socket.id}</p>}</div>
      <Carousel />
      <Link to="/live">라이브</Link>
      <Link to="/list">NFT</Link>
      <Outlet />
    </div>
  );
};

export default Main;
