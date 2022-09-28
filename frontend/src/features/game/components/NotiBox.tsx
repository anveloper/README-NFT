import React, { useContext, useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
// state
import { SocketContext } from "../../../socketConfig";
import { truncatedAddress } from "../../auth/authSlice";
import { selectHostUserName } from "../gameSlice";
// css
import styles from "../Game.module.css";
const NotiBox = () => {
  const socket = useContext(SocketContext);
  const hostUserName = useAppSelector(selectHostUserName);
  const shortHostAddress = truncatedAddress(hostUserName);
  const dtext = `${shortHostAddress}님의 게임룸 입니다.`;
  const [noti, setNoti] = useState(dtext);
  const [bgColor, setBgColor] = useState("#ff713e");
  useEffect(() => {
    if (socket) {
      socket.on("noti_send", (msg, color) => {
        setNoti(msg);
        setBgColor(color);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div
      key={noti}
      className={styles.notiBox}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className={styles.track1}>
        <div className={styles.content}>{`${noti}`}</div>
      </div>
      <div className={styles.track2}>
        <div className={styles.content}>{`${noti}`}</div>
      </div>
    </div>
  );
};

export default NotiBox;
