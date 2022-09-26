// core
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { io } from "socket.io-client";
// state
import { selectSocket, setRoomInfo, setSocket } from "../game/gameSlice";
import { selectUserAddress, selectUserName } from "../auth/authSlice";
import RoomButton from "./components/RoomButton";
// component
import NewHelmet from "../../components/NewHelmet";
import Carousel from "./components/Carousel";
import MainTab from "./components/MainTab";
import { Modal } from "../../components/modal/Modal";
// css
import styles from "./Main.module.css";
import Guide from "./Guide";

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

  useEffect(() => {
    if (socket === undefined) {
      console.log(socketURL);
      dispatch(setSocket(io(socketURL)));
    } else {
      console.log("연결된 소켓 정보", socket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
    <div>
      <NewHelmet
        title="리드미 & NFT"
        description="README 게임 라이브 목록 및 NFT 목록을 보여줍니다."
      />
      <Guide />
      <Carousel />
      <MainTab />
      <Outlet />
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
