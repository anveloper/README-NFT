// core
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
//state
import { selectSocket, setRoomList } from "../game/gameSlice";

import styles from "./Main.module.css";
const LiveList = () => {
  const socket = useAppSelector(selectSocket);
  const listRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(socket.id);
      });
      socket.on("init_room", (rooms: []) => {
        dispatch(setRoomList(rooms));
      });
    }
  }, [dispatch, socket]);
  useEffect(() => {
    if (pathname === "/live")
      listRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, [pathname]);
  return (
    <div className={styles.liveContainer} ref={listRef}>
      LiveList
    </div>
  );
};

export default LiveList;
