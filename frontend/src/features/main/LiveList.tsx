// core
import React, { useEffect, useState, useRef, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
//state
import { selectRoomList, setRoomList, setRoomInfo } from "../game/gameSlice";
import { selectUserAddress, selectUserName } from "../auth/authSlice";
// components
import LiveItem from "../../components/liveItem/LiveItem";
import { Modal } from "../../components/modal/Modal";
import styles from "./Main.module.css";
import { SocketContext } from "../../socketConfig";

const LiveList = () => {
  const socket = useContext(SocketContext);
  const userAddress = useAppSelector(selectUserAddress);
  const userName = useAppSelector(selectUserName);
  const roomList = useAppSelector(selectRoomList);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [itemCnt, setItemCnt] = useState(8);
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
        (
          title: string,
          cnt: number,
          host: any,
          answerLength: number,
          data: string
        ) => {
          setModalOpen(false);
          setRegisterRoomName("");
          dispatch(
            setRoomInfo({
              roomName: title,
              roomCnt: cnt,
              hostUserName: host,
              answerLength: answerLength,
              participants: JSON.parse(data),
            })
          );
          navigator(`/game/${host}`);
        }
      );
    }
  };
  const handleScroll = () => {
    moreRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.liveContainer} ref={moreRef}>
          {roomList.map((room, index) => {
            if (index >= itemCnt) return null;
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
          {roomList && roomList.length > itemCnt && (
            <div className={styles.moreBtn}>
              <button
                onClick={() => {
                  setItemCnt(itemCnt + 4);
                  handleScroll();
                }}
              >
                더 보기
              </button>
            </div>
          )}
        </div>
      </div>
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
    </>
  );
};

export default LiveList;
