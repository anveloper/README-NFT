import React, { useState, useEffect } from "react";

// css
import styles from "../Game.module.css";
const TimerBox = () => {
  const MAX_TIME = 100;
  const [time, setTime] = useState(MAX_TIME);
  const [isStart, setIsStart] = useState(false);
  let per = Math.round(((time) * 100) / MAX_TIME);
  useEffect(() => {
    const countdown = setInterval(() => {
      if (isStart && time > 0) {
        setTime(time - 1);
      }
      if (time === 0) {
        setIsStart(false);
        setTime(MAX_TIME);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [isStart, time]);
  return (
    <div className={styles.timerBox}>
      <div className={styles.timeSlider}>
        <div className={styles.time} style={{ width: `${per}%` }} />
        <p className={styles.remain}>남은 시간 : {time}초</p>
      </div>
      <button className={styles.submit} onClick={() => setIsStart(true)}>
        제출
      </button>
    </div>
  );
};

export default TimerBox;
