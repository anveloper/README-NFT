// core
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
//state
import {
  selectSocket,
  selectRoomList,
  setRoomList,
  setRoomInfo,
} from "../game/gameSlice";
import { selectUserAddress, selectUserName } from "../auth/authSlice";
// components
import LiveItem from "../../components/liveItem/LiveItem";
import { Modal } from "../../components/modal/Modal";
import styles from "./Main.module.css";

const LiveList = () => {
  const socket = useAppSelector(selectSocket);
  const userAddress = useAppSelector(selectUserAddress);
  const userName = useAppSelector(selectUserName);
  const roomList = useAppSelector(selectRoomList);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [registerRoomName, setRegisterRoomName] = useState("");
  const [registrtHostAddress, setRegisterHostAddress] = useState("");
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(socket.id);
      });
      socket.on("init_room", (rooms: string) => {
        const data = JSON.parse(rooms);
        dispatch(setRoomList(data));
      });
      socket.on("room_change", (rooms: string) => {
        const data = JSON.parse(rooms);
        dispatch(setRoomList(data));
      });
    }
  }, [dispatch, socket]);

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleJoinRoom = () => {
    if (socket) {
      socket.emit(
        "join_room",
        userAddress,
        userName,
        registrtHostAddress,
        (title: string, cnt: number, host: any, answerLength: number) => {
          setModalOpen(false);
          console.log(host);
          setRegisterRoomName("");
          dispatch(
            setRoomInfo({
              roomName: title,
              roomCnt: cnt,
              hostUserName: host,
              answerLength: answerLength,
            })
          );
          navigator(`/game/${host}`);
        }
      );
    }
  };
  return (
    <div className={styles.liveContainer}>
      <Modal
        open={modalOpen}
        close={closeModal}
        fn={handleJoinRoom}
        header="내 마음을 읽어줘 - 방 참여하기"
      >
        <div className={styles.modalBox}>
          <p className={styles.modalText}>방제목 : </p>
          <p>{registerRoomName}</p>
        </div>
      </Modal>
      {roomList.map((room, index) => {
        return (
          <LiveItem
            key={index}
            value={room.host}
            title={room.title}
            cnt={room.cnt}
            host={room.host}
            handleJoinRoom={() => {
              setModalOpen(true);
              setRegisterRoomName(room.title);
              setRegisterHostAddress(room.host);
            }}
          />
        );
      })}
    </div>
  );
};

export default LiveList;
