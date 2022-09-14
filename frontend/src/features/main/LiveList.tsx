// core
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
//state
import { selectSocket, setRoomList } from "../game/gameSlice";

const LiveList = () => {
  const socket = useAppSelector(selectSocket);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {console.log(socket.id)});
      socket.on("init_room", (rooms: []) => {
        dispatch(setRoomList(rooms));
      });
    }
  }, [dispatch, socket]);

  return <div>LiveList</div>;
};

export default LiveList;
