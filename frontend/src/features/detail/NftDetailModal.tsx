import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NftDetailModal.module.css";

const NftDetailModal = (props: any) => {
  const { close, image, answer, tokenId } = props;
  const [inputAnswer, setInputAnswer] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e: any) => {
    setInputAnswer(e.target.value);
  };

  const checkAnswer = (inputAnswer: any) => {
    if (inputAnswer === answer) {
      setIsAnswer(true);
      setInfoMsg("정답입니다.");
    } else {
      setIsAnswer(false);
      setInfoMsg("오답입니다! 다시 시도해보세요.");
    }
  };

  const moveToDetail = (tokenId: string) => {
    console.log("true");
    navigate("/detail/" + tokenId);
  };

  return (
    <div className={styles.MyModal}>
      <div className={styles.content}>
        <h3>리드미 정답 맞추기</h3>
        <div className={styles.cards}>
          <div className={styles.cards_left}>
            <img className={styles.card_img} src={image} alt="dog" />
          </div>
          <div className={styles.cards_right}>
            <div className={styles.info_box}>
              <div className={styles.info}>
                {/* <div style={{ fontSize: "20px" }}>💡</div> */}
                <p>NFT의 제목을 맞춰보세요!</p>
                <p>정답을 맞추면 NFT를 구매할 수 있어요.</p>
              </div>
            </div>
            <div className={styles.answer}>
              <p className={styles.input_msg}>정답이 무엇일까요?</p>
              <input className={styles.input} type="text" name="inputAnswer" onChange={onChange} value={inputAnswer} />
              <button className={styles.input_button} onClick={() => checkAnswer(inputAnswer)}>
                제출
              </button>
              <div className={styles.result_msg}>
                {infoMsg && <p className={isAnswer ? `${styles.result_msg_answer}` : `${styles.result_msg_wrong}`}>{infoMsg}</p>}
              </div>
            </div>
            <div className={styles.card_buttons}>
              <button
                disabled={!isAnswer}
                className={isAnswer ? `${styles.card_button_on}` : `${styles.card_button_off}`}
                onClick={() => moveToDetail(tokenId)}
              >
                자세히 보기
              </button>
              <button className={styles.card_button_on}>찜하기</button>
            </div>
          </div>
        </div>

        <button onClick={close}>닫기</button>
      </div>
    </div>
  );
};

export default NftDetailModal;
