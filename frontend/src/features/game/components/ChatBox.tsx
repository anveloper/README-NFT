import React, { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
// state
import {
  selectMessages,
  selectSocket,
  setMessages,
  setRoomCnt,
  MSG,
  selectHostUserName,
} from "../gameSlice";

import styles from "../Game.module.css";
const ChatBox = () => {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLDivElement | null>(null);
  const messages = useAppSelector(selectMessages);
  const hostUserName = useAppSelector(selectHostUserName);
  const socket = useAppSelector(selectSocket);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (socket) {
      socket.on("bye", (user: string, cnt: number) => {
        dispatch(setRoomCnt(cnt));
        dispatch(
          setMessages(MSG("system", user, `[${user}]님이 퇴장하셨습니다.`))
        );
      });
      socket.on("welcome", (user: string, cnt: number) => {
        dispatch(setRoomCnt(cnt));
        dispatch(
          setMessages(MSG("system", user, `[${user}]님이 입장하셨습니다.`))
        );
      });
      socket.on("new_message", (user: string, msg: string) => {
        dispatch(setMessages(MSG("other", user, msg)));
        console.log("NewMessage", `${user}: ${msg}`);
      });
    }
  }, [dispatch, socket]);

  useEffect(() => {
    lastRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);
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
      <div className={styles.chatBox}>
        <div className={styles.chatList}>
          {messages.map((msg, index) => {
            if (index !== messages.length - 1)
              return (
                <div key={index} className={styles.chatItem}>
                  {`${msg.name} : (${msg.type}) ${msg.msg}`}
                </div>
              );
            else
              return (
                <div ref={lastRef} key={index} className={styles.chatItem}>
                  {`${msg.name} : (${msg.type}) ${msg.msg}`}
                </div>
              );
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
