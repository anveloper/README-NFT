// core
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
// state
import { SocketContext } from "../../socketConfig";
import {
  resetRoomInfo,
  selectHostUserName,
  selectRoomCnt,
  selectRoomName,
} from "./gameSlice";
import { selectUserAddress, truncatedAddress } from "../auth/authSlice";
// component
import NewHelmet from "../../components/NewHelmet";
import AnswerBox from "./components/AnswerBox";
import CanvasBox from "./components/CanvasBox";
import TimerBox from "./components/TimerBox";
import ToolBox from "./components/ToolBox";
import NotiBox from "./components/NotiBox";
import MemberBox from "./components/MemberBox";
import ChatBox from "./components/ChatBox";
import CanvasSpring from "../../assets/live-item/canvas_spring.svg";
// css
import styles from "./Game.module.css";
const Game = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const socket = useContext(SocketContext);
  const roomName = useAppSelector(selectRoomName);
  const hostUserName = useAppSelector(selectHostUserName);
  const shortHostAddress = truncatedAddress(hostUserName);
  const roomCnt = useAppSelector(selectRoomCnt);
  const [tabFlag, setTabFlag] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!hostUserName) navigate("/live");
    return () => {
      dispatch(resetRoomInfo());
      if (socket) socket.emit("leave_room", hostUserName);
      if (hostUserName === userAddress) {
        socket.emit(
          "game_end",
          hostUserName,
          (answer: string, solver: string) => {
            console.log(answer, solver);
          }
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(socket);
  }, [socket]);
  const handleExit = () => {
    // if (socket) {
    //   if (hostUserName === userAddress) {
    //     socket.emit(
    //       "game_end",
    //       hostUserName,
    //       (answer: string, solver: string) => {
    //         console.log(answer, solver);
    //       }
    //     );
    //   }
    //   socket.emit("leave_room", hostUserName);
    // } // App.tsx 이동, 두번 출력 로직 제거인데, 주석을 지우진 않겠습니다.
    dispatch(resetRoomInfo());
    navigate("/live");
  };

  return (
    <div className={styles.container}>
      <NewHelmet
        title={roomName}
        description={`${hostUserName}님의 리드미 게임룸입니다.`}
      />
      <div className={styles.content}>
        <div className={styles.btnBox}>
          <button className={styles.exit} onClick={handleExit}>
            종료
          </button>
          <p>
            {roomName} 🖌️ {shortHostAddress}님의 리드미
          </p>
        </div>
        <div className={styles.contentBox}>
          <AnswerBox />
          <div className={styles.paperBox}>
            <img className={styles.springOne} src={CanvasSpring} alt="" />
            <img className={styles.springTwo} src={CanvasSpring} alt="" />
            <CanvasBox />
          </div>
          <ToolBox />
        </div>
        <TimerBox />
      </div>
      <div className={styles.social}>
        <NotiBox />
        <div className={styles.tab}>
          <button
            className={tabFlag ? `${styles.active}` : ""}
            onClick={() => setTabFlag(true)}
          >
            채팅창
          </button>
          <button
            className={tabFlag ? "" : `${styles.active}`}
            onClick={() => setTabFlag(false)}
          >
            참여자({roomCnt})
          </button>
        </div>
        <MemberBox visible={!tabFlag} />
        <ChatBox />
      </div>
    </div>
  );
};

export default Game;
