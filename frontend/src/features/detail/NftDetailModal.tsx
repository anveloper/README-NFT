import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserAddress } from "../auth/authSlice";
import { findSolveList, postProblem } from "../nft/nftSlice";
import axios from "api/Axios";
import api from "api/api";
import styles from "./NftDetailModal.module.css";

const NftDetailModal = (props: any) => {
  const userAddress = useAppSelector(selectUserAddress);
  const { close, image, answer, tokenId } = props;
  const [inputAnswer, setInputAnswer] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [likeButtonText, setLikeButtonText] = useState("찜하기");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onChange = (e: any) => {
    setInputAnswer(e.target.value);
  };

  const checkAnswer = (inputAnswer: any) => {
    if (inputAnswer === answer) {
      setIsAnswer(true);
      setInfoMsg("정답입니다.");
      dispatch(postProblem({ userAddress, tokenId }));
      dispatch(findSolveList(userAddress));
      setInputAnswer("");
      close();
    } else if (inputAnswer.length >= 1 && inputAnswer !== answer) {
      setIsAnswer(false);
      setInfoMsg("오답입니다! 다시 시도해보세요.");
      setInputAnswer("");
      inputRef?.current.focus();
    } else if (inputAnswer.length < 1) {
      setInfoMsg("정답을 입력해주세요.");
    }
  };

  const moveToDetail = (tokenId: string) => {
    console.log("true");
    navigate("/detail/" + tokenId);
  };

  const likeNFT = async (tokenId: number) => {
    await axios
      .put(api.like.likeNFT(), {
        tokenId: tokenId,
        walletAddress: userAddress,
      })
      .then((res) => {
        console.log(res);
        if (res.data.count === 1) {
          setLikeButtonText("찜하기 취소");
        } else {
          setLikeButtonText("찜하기");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const checkLikeNFT = async () => {
      await axios
        .put(api.like.likeNFT(), {
          tokenId: parseInt(tokenId),
          walletAddress: userAddress,
        })
        .then(async (res) => {
          if (res.data.count === 1) {
            setLikeButtonText("찜하기");
            await axios.put(api.like.likeNFT(), {
              tokenId: parseInt(tokenId),
              walletAddress: userAddress,
            });
          } else {
            setLikeButtonText("찜하기 취소");
            await axios.put(api.like.likeNFT(), {
              tokenId: parseInt(tokenId),
              walletAddress: userAddress,
            });
          }
        });
    };
    checkLikeNFT();
  }, []);

  return (
    <div className={styles.MyModal}>
      <div className={styles.content}>
        <div className={styles.cards}>
          <button className={styles.card_button_close} id={styles.close1}>
            ㄷㄷ
          </button>
          <h3>리드미 정답 맞추기</h3>
          <button className={styles.card_button_close} onClick={close}>
            닫기
          </button>
        </div>
        <div className={styles.cards}>
          <div className={styles.cards_left}>
            <img className={styles.card_img} src={image} alt="dog" />
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.cards_right}>
            <div className={styles.info_box}>
              <div className={styles.info}>
                {/* {<div style={{ fontSize: "20px" }}>💡</div>} */}
                <p>리드미의 제목을 맞춰보세요!</p>
                <p>정답을 맞추면 리드미를 구매할 수 있어요.</p>
              </div>
            </div>
            <div className={styles.answer}>
              <p className={styles.input_msg}>정답은 무엇일까요?</p>
              <div className={styles.input}>
                <input
                  ref={inputRef}
                  className={styles.input_text}
                  type="text"
                  name="inputAnswer"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") checkAnswer(inputAnswer);
                  }}
                  onChange={onChange}
                  value={inputAnswer}
                />
                <button className={styles.input_button} onClick={() => checkAnswer(inputAnswer)}>
                  제출
                </button>
              </div>
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
              <button className={styles.card_button_on} onClick={() => likeNFT(parseInt(tokenId))}>
                {likeButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetailModal;

/*

<div className={styles.info_box}>
              <div className={styles.info}>
                {/* <div style={{ fontSize: "20px" }}>💡</div> }
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
            </div>*/
