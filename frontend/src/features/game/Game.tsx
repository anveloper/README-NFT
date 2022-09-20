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
  setColor,
} from "./gameSlice";
import { selectUserAddress } from "../auth/authSlice";
// component
import NewHelmet from "../../components/NewHelmet";
import CanvasBox from "./components/CanvasBox";
import TimerBox from "./components/TimerBox";
import ChatBox from "./components/ChatBox";
import CanvasSpring from "../../assets/live-item/canvas_spring.svg";
// css
import styles from "./Game.module.css";
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
    return () => {
      dispatch(resetRoomInfo());
    };
  }, [dispatch]);

  const handleExit = () => {
    if (socket) {
      socket.emit("leave_room", hostUserName);
      if (hostUserName === userAddress) {
        socket.emit("host_leave", hostUserName);
      }
    }
    dispatch(resetRoomInfo());
    navigate("/live");
  };

  const handleColor = (e: any) => {
    e.preventDefault();
    dispatch(setColor(e.target.value));
  };
  const handleCanvasReset = () => {
    if (socket) {
      socket.emit("reset_canvas", hostUserName);
    }
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
          <div className={styles.answerBox}>
            <p style={{ width: "120px" }} />
            <div>
              <p>정</p>
              <p>답</p>
              <p>란</p>
            </div>
            <p className={styles.what}>14/273</p>
          </div>
          <div className={styles.paperBox}>
            <img className={styles.springOne} src={CanvasSpring} alt="" />
            <img className={styles.springTwo} src={CanvasSpring} alt="" />
            <CanvasBox />
          </div>
          <div className={styles.toolBox}>
            <form className={styles.colorBox} onClick={handleColor}>
              <button value={"#000000"} style={{ background: "#000000" }}>
                검정
              </button>
              <button value={"#D93D04"} style={{ background: "#D93D04" }}>
                빨강
              </button>
              <button value={"#FDDF61"} style={{ background: "#FDDF61" }}>
                노랑
              </button>
              <button value={"#3B82BF"} style={{ background: "#3B82BF" }}>
                파랑
              </button>
              <button value={"#79C4F2"} style={{ background: "#79C4F2" }}>
                하늘
              </button>
            </form>
            <div className={styles.erase}>
              <button
                onClick={() => {
                  dispatch(setColor("#ffffff"));
                }}
              >
                지우개
              </button>
              <button onClick={handleCanvasReset}>초기화</button>
            </div>
          </div>
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
        <ChatBox />
      </div>
    </div>
  );
};

export default Game;
