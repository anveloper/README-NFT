import React, { useEffect, useState, useRef, useContext } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
// state
import {
  selectMessages,
  setMessages,
  setRoomCnt,
  MSG,
  selectHostUserName,
  setAnswerLength,
  setSolvers,
  setStarted,
  setParticipants,
} from "../gameSlice";

import styles from "../Game.module.css";
import { SocketContext } from "../../../socketConfig";

const ChatBox = () => {
  const [newMessage, setNewMessage] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLDivElement | null>(null);
  const messages = useAppSelector(selectMessages);
  const hostUserName = useAppSelector(selectHostUserName);
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (socket) {
      socket.on("bye", (user: string, cnt: number, data: string) => {
        dispatch(setRoomCnt(cnt));
        dispatch(setParticipants(JSON.parse(data)));
        dispatch(
          setMessages(MSG("system", user, `[${user}]님이 퇴장하셨습니다.`))
        );
      });
      socket.on("welcome", (user: string, cnt: number, data: string) => {
        dispatch(setRoomCnt(cnt));
        dispatch(setParticipants(JSON.parse(data)));
        dispatch(
          setMessages(MSG("system", user, `[${user}]님이 입장하셨습니다.`))
        );
      });
      socket.on("new_message", (user: string, msg: string) => {
        dispatch(setMessages(MSG("other", user, msg)));
        // console.log("NewMessage", `${user}: ${msg}`);
      });
      socket.on("reset_answer", (cnt) => {
        socket.emit("reset_answer", hostUserName);
        dispatch(setAnswerLength(cnt));
      });
      socket.on("solve_cnt", (solver, solversCnt, roomCnt) => {
        dispatch(setSolvers({ solver, solversCnt, roomCnt }));
      });
      socket.on("game_start", () => {
        dispatch(setStarted(true));
      });
      socket.on("host_leave", () => {
        socket.emit("leave_room", hostUserName);
        navigate("/live");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    lastRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages, boxRef.current?.clientHeight]);
  const handleNewMessage = () => {
    if (newMessage.length === 0) {
      inputRef.current?.focus();
      return;
    }
    if (socket) {
      socket.emit("new_message", hostUserName, newMessage, (msg: string) => {
        dispatch(setMessages(MSG("mine", "나", msg)));
        setNewMessage("");
        inputRef.current?.focus();
      });
    }
  };
  return (
    <>
      <div ref={boxRef} className={styles.chatBox}>
        <div className={styles.chatList}>
          {messages.map((m, index) => {
            const { name, type, msg } = m;
            if (index !== messages.length - 1) {
              if (type === "mine")
                return (
                  <div key={index} className={styles.mine}>
                    <p>{msg}</p>
                  </div>
                );
              else if (type === "system")
                return (
                  <div key={index} className={styles.system}>
                    <p>{msg}</p>
                  </div>
                );
              else if (type === "other")
                return (
                  <div key={index} className={styles.other}>
                    <h6>{name}</h6>
                    <p>{msg}</p>
                  </div>
                );
            } else {
              if (type === "mine")
                return (
                  <div ref={lastRef} key={index} className={styles.mine}>
                    <p>{msg}</p>
                  </div>
                );
              else if (type === "system")
                return (
                  <div ref={lastRef} key={index} className={styles.system}>
                    <p>{msg}</p>
                  </div>
                );
              else if (type === "other")
                return (
                  <div ref={lastRef} key={index} className={styles.other}>
                    <h6>{name}</h6>
                    <p>{msg}</p>
                  </div>
                );
            }
          })}
        </div>
      </div>
      <div className={styles.inputBox}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleNewMessage();
          }}
        />
        <button className={styles.send} onClick={handleNewMessage}>
          전송
        </button>
      </div>
    </>
  );
};

export default ChatBox;
