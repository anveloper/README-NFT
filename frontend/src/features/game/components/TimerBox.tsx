import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { selectHostUserName, selectSocket, setTimeover } from "../gameSlice";
// css
import styles from "../Game.module.css";
import { selectUserAddress } from "../../auth/authSlice";
const TimerBox = () => {
  const socket = useAppSelector(selectSocket);
  const userAddress = useAppSelector(selectUserAddress);
  const hostUserName = useAppSelector(selectHostUserName);
  const MAX_TIME = 5;
  const [time, setTime] = useState(MAX_TIME);
  const [isStart, setIsStart] = useState(false);
  let per = Math.round((time * 100) / MAX_TIME);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const countdown = setInterval(() => {
      if (isStart && time > 0) {
        setTime(time - 1);
      }
      if (time === 0) {
        setIsStart(false);
        setTime(MAX_TIME);
        if (userAddress === hostUserName) dispatch(setTimeover(true));
      }
    }, 1000);
    return () => clearInterval(countdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart, time]);

  useEffect(() => {
    if (socket && userAddress !== hostUserName) {
      socket.on("timer_start", (time: number) => {
        setIsStart(true);
        setTime(time);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleTimerStart = () => {
    setIsStart(true);
    if (socket && userAddress === hostUserName)
      socket.emit("timer_start", hostUserName, MAX_TIME);
  };
  return (
    <div className={styles.timerBox}>
      <div className={styles.timeSlider}>
        <div className={styles.time} style={{ width: `${per}%` }} />
        <p className={styles.remain}>남은 시간 : {time}초</p>
      </div>
      <button className={styles.submit} onClick={handleTimerStart}>
        제출
      </button>
    </div>
  );
};

export default TimerBox;
