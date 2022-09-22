import React from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
// state
import {
  selectHostUserName,
  selectSocket,
  setColor,
} from "../gameSlice";
import { selectUserAddress } from "../../auth/authSlice";
// css
import styles from "../Game.module.css";
const ToolBox = () => {
  const socket = useAppSelector(selectSocket);
  const userAddress = useAppSelector(selectUserAddress);
  const hostUserName = useAppSelector(selectHostUserName);
  const dispatch = useAppDispatch();
  const handleColor = (e: any) => {
    e.preventDefault();
    dispatch(setColor(e.target.value));
  };
  const handleCanvasReset = () => {
    if (socket) {
      if (userAddress !== hostUserName) return;
      socket.emit("reset_canvas", hostUserName);
      console.log(userAddress, hostUserName);
    }
  };
  return (
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
  );
};

export default ToolBox;
