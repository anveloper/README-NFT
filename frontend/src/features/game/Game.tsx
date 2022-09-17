import React, { useState } from "react";

import CanvasSpring from "../../assets/live-item/canvas_spring.svg";
import styles from "./Game.module.css";
const Game = () => {
  const [tabFlag, setTabFlag] = useState(true);
  const [time, setTime] = useState(40);
  let per = Math.round(((60 - time) * 100) / 60);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.btnBox}>
          <button className={styles.exit}>종료</button>
        </div>
        <div className={styles.canvasBox}>
          <div className={styles.answerBox}>
            <p style={{ width: "120px" }} />
            <div>
              <p>정</p>
              <p>답</p>
              <p>이</p>
            </div>
            <p className={styles.what}>14/273</p>
          </div>
          <div className={styles.paperBox}>
            <div className={styles.paper}>
              <img className={styles.springOne} src={CanvasSpring} alt="" />
              <img className={styles.springTwo} src={CanvasSpring} alt="" />
            </div>
          </div>
          <div className={styles.toolBox}>
            <div className={styles.colorBox}>
              <button style={{ background: "#000000" }}>검정</button>
              <button style={{ background: "#D93D04" }}>빨강</button>
              <button style={{ background: "#FDDF61" }}>노랑</button>
              <button style={{ background: "#3B82BF" }}>파랑</button>
              <button style={{ background: "#79C4F2" }}>하늘</button>
            </div>
            <div className={styles.erase}>
              <button>지우개</button>
              <button>초기화</button>
            </div>
          </div>
        </div>
        <div className={styles.timerBox}>
          <div className={styles.timeSlider}>
            <div className={styles.time} style={{ width: `${per}%` }} />
            <p className={styles.remain}>남은 시간 : {time}초</p>
          </div>
          <button className={styles.submit}>제출</button>
        </div>
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
            참여자
          </button>
        </div>
        <div className={styles.chatBox}>
          <div className={styles.chatList}>
            <div className={styles.chatItem}>닉네임과 채팅내용 1</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 2</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 3</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 4</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 5</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 6</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 7</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 8</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 9</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 10</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 11</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 12</div>
            <div className={styles.chatItem}>닉네임과 채팅내용 13</div>
          </div>
        </div>
        <div className={styles.inputBox}>
          <input className={styles.input} type="text" />
          <button className={styles.send}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default Game;
