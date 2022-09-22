// core
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { io } from "socket.io-client";
// state
import { selectSocket, setRoomInfo, setSocket } from "../game/gameSlice";
import { selectUserAddress, selectUserName } from "../auth/authSlice";
// component
import NewHelmet from "../../components/NewHelmet";
import Carousel from "./Carousel";
import MainTab from "./components/MainTab";
import { Modal } from "../../components/modal/Modal";
import RoomButton from "./components/RoomButton";
// css
import styles from "./Main.module.css";

const socketURL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "https://j7b108.p.ssafy.io";

const Main = () => {
  const socket = useAppSelector(selectSocket);
  const userAddress = useAppSelector(selectUserAddress);
  const userName = useAppSelector(selectUserName);
  const [modalOpen, setModalOpen] = useState(false);
  const [registerRoomName, setRegisterRoomName] = useState("");
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) {
      console.log(socketURL);
      dispatch(setSocket(io(socketURL)));
    } else {
      console.log("연결된 소켓 정보", socket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (pathname === "/")
      mainRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, [pathname]);

  const closeModal = () => {
    setModalOpen(false);
    setRegisterRoomName("");
  };
  const handleEnterRoom = () => {
    if (socket) {
      socket.emit(
        "enter_room",
        userAddress,
        userName,
        registerRoomName,
        (room: string, cnt: number, host: any, data: string) => {
          setModalOpen(false);
          setRegisterRoomName("");
          dispatch(
            setRoomInfo({
              roomName: room,
              roomCnt: cnt,
              hostUserName: host,
              answerLength: 0,
              participants: JSON.parse(data),
            })
          );
          navigator(`/game/${host}`);
        }
      );
    }
  };
  return (
    <div className={styles.mainContainer} ref={mainRef}>
      <NewHelmet
        title="리드미 & NFT"
        description="README 게임 라이브 목록 및 NFT 목록이 나타납니다."
      />
      <Carousel />
      <MainTab />
      <div className={styles.container}>
        <Outlet />
      </div>
      <Modal
        open={modalOpen}
        close={closeModal}
        fn={handleEnterRoom}
        header="내 마음을 읽어줘 - 방 만들기"
      >
        <div className={styles.modalBox}>
          <p className={styles.modalText}>방제목 : </p>
          <input
            className={styles.modalInput}
            type="text"
            value={registerRoomName}
            onChange={(e) => {
              setRegisterRoomName(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleEnterRoom();
              }
            }}
          />
        </div>
      </Modal>
      {socket && <RoomButton setModalOpen={setModalOpen} />}
    </div>
  );
};

export default Main;
