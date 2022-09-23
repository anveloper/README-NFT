import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Modal } from "../../../components/modal/Modal";
import { selectUserAddress } from "../../auth/authSlice";
// css
import styles from "../Game.module.css";
import {
  selectAnswer,
  selectAnswerLength,
  selectHostUserName,
  selectRoomCnt,
  selectSocket,
  selectSolversCnt,
  setAnswer,
} from "../gameSlice";
const AnswerBox = () => {
  const socket = useAppSelector(selectSocket);
  const answer = useAppSelector(selectAnswer);
  const answerLength = useAppSelector(selectAnswerLength);
  const hostUserName = useAppSelector(selectHostUserName);
  const userAddress = useAppSelector(selectUserAddress);

  const roomCnt = useAppSelector(selectRoomCnt);
  const solversCnt = useAppSelector(selectSolversCnt);

  const [answerModal, setAnswerModal] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const answerRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();
  const handleAnswer = () => {
    if (!newAnswer) {
      answerRef.current?.focus();
      return;
    }
    if (socket) {
      socket.emit("set_answer", hostUserName, newAnswer, (ans: string) => {
        dispatch(setAnswer(ans));
        setAnswerModal(false);
        setNewAnswer("");
        console.log(ans);
      });
      socket.emit("game_start", hostUserName);
    }
  };
  const renderAnswer = () => {
    if (!answer) return <p>제시어를 입력해주세요.</p>;
    const result = [];
    for (let i = 0; i < answer.length; i++)
      result.push(<p key={i}>{answer[i]}</p>);
    return result;
  };
  const renderAnswerLength = (num: number) => {
    if (!num) return <p>제시어가 입력되지 않았습니다.</p>;
    const result = [];
    for (let i = 0; i < num; i++) result.push(<p key={i}>?</p>);
    return result;
  };

  if (hostUserName === userAddress) {
    return (
      <>
        <Modal
          open={answerModal}
          close={() => setAnswerModal(false)}
          fn={handleAnswer}
          header={"🖋 제시어를 입력해주세요."}
        >
          <h6 className={styles.answerNoti}>
            정답을 입력하면 호스트만 그림을 그릴 수 있습니다.
            <br />
            제시어를 누르면 언제든 수정할 수 있습니다.
          </h6>
          <input
            value={newAnswer}
            ref={answerRef}
            className={styles.answerInput}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleAnswer();
            }}
            onChange={(e) => {
              if (newAnswer.length < 11) setNewAnswer(e.target.value.trim());
              else setNewAnswer(e.target.value.substring(0, 9));
            }}
          />
        </Modal>
        <div className={styles.answerBox}>
          <p style={{ width: "120px" }} />
          <div onClick={() => setAnswerModal(true)}>
            <>{renderAnswer()}</>
          </div>
          <p className={styles.what}>
            {solversCnt}/{roomCnt}
          </p>
        </div>
      </>
    );
  } else
    return (
      <div className={styles.answerBox}>
        <p style={{ width: "120px" }} />
        <div>
          <>{renderAnswerLength(answerLength)}</>
        </div>
        <p className={styles.what}>
          {solversCnt}/{roomCnt}
        </p>
      </div>
    );
};

export default AnswerBox;
