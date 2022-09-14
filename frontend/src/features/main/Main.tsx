// core
import React, { DetailsHTMLAttributes, useEffect, useRef } from "react";
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
  const contentRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) {
      dispatch(setSocket(io(socketURL)));
    } else {
      console.log("연결된 소켓 정보", socket);
    }
  }, [dispatch, socket]);
  const scrollToDiv = () => {
    contentRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.mainContainer}>
      <NewHelmet
        title="목록"
        description="README 게임 라이브 목록 및 NFT 목록이 나타납니다."
      />
      <Carousel />
      <div className={styles.btnBox}>
        <Link to="/live">
          <button className={styles.btn} onClick={scrollToDiv}>
            라이브 게임
          </button>
        </Link>
        <Link to="/list">
          <button className={styles.btn} onClick={scrollToDiv}>
            마켓 리스트
          </button>
        </Link>
      </div>
      <div>{socket && <p>{socket.id}</p>}</div>
      <Outlet />
      <div ref={contentRef} />
    </div>
  );
};

export default Main;
