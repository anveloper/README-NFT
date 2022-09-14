// core
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
//state
import { selectSocket, setRoomList } from "../game/gameSlice";

import styles from "./Main.module.css";
const LiveList = () => {
  const socket = useAppSelector(selectSocket);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

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
    document.getElementById("scrollbar")!.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.liveContainer} id="scrollbar">
      LiveList
    </div>
  );
};

export default LiveList;
