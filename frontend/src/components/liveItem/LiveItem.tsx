import React from "react";

import LiveBadge from "../../assets/live-item/live_badge.svg";
import LiveCnt from "../../assets/live-item/live_cnt.svg";
import IMG from "../../assets/game_frame.svg";

import styles from "./LiveItem.module.css";

const LiveItem = (prop: any) => {
  const { title, host, cnt, handleJoinRoom } = prop;

  return (
    <button
      className={styles.container}
      onClick={() => {
        handleJoinRoom(title);
      }}
    >
      <img className={styles.img} src={IMG} alt="" />
      <img className={styles.badge} src={LiveBadge} alt="" />
      <div>
        <div className={styles.title}>
          <div className={styles.track}>
            <p className={styles.content}>{title}</p>
          </div>
        </div>
        <div className={styles.cntBox}>
          <img className={styles.cnt} src={LiveCnt} alt="" />
          <p className={styles.n}>{cnt}</p>
        </div>
      </div>
    </button>
  );
};

export default LiveItem;
