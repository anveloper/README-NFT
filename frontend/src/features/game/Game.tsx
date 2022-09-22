// core
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
// state
import {
  resetRoomInfo,
  selectHostUserName,
  selectRoomCnt,
  selectRoomName,
  selectSocket,
} from "./gameSlice";
import { selectUserAddress } from "../auth/authSlice";
// component
import NewHelmet from "../../components/NewHelmet";
import AnswerBox from "./components/AnswerBox";
import CanvasBox from "./components/CanvasBox";
import TimerBox from "./components/TimerBox";
import ChatBox from "./components/ChatBox";
import CanvasSpring from "../../assets/live-item/canvas_spring.svg";
// css
import styles from "./Game.module.css";
import ToolBox from "./components/ToolBox";
import MemberBox from "./components/MemberBox";
const Game = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const socket = useAppSelector(selectSocket);
  const roomName = useAppSelector(selectRoomName);
  const hostUserName = useAppSelector(selectHostUserName);
  const roomCnt = useAppSelector(selectRoomCnt);

  const [tabFlag, setTabFlag] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!hostUserName) navigate("/live");
    return () => {
      dispatch(resetRoomInfo());
      if (socket) socket.emit("leave_room", hostUserName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExit = () => {
    if (socket) {
      if (hostUserName === userAddress) {
        socket.emit(
          "game_end",
          hostUserName,
          (answer: string, solver: string) => {
            console.log(answer, solver);
          }
        );
      }
      socket.emit("leave_room", hostUserName);
    }
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
        <div className={styles.notiBox}>알림창이 위치할 자리입니다.</div>
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
        <ChatBox/>
      </div>
    </div>
  );
};

export default Game;
