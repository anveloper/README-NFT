//img
import game_frame from "../../../assets/game_frame.svg";
import cat from "../../../assets/characters/cat_palette.svg";
import rabbit from "../../../assets/characters/rabbit_palette.svg";

// css
import styles from "../Welcome.module.css";

const GameDescription = () => {
  return (
    <div className={styles.GameDescription}>
      <h2 className={styles.GameDescriptionTitle}>
        게임을 통해 특별한 NFT를 소유하세요!
      </h2>
      <p>
        게임 설명 텍스트
        <br />
        게임 설명 텍스트
        <br />
        게임 설명 텍스트
        <br />
      </p>
      <div className={styles.GameDescriptionImg}>
        <img className={styles.GameFrame} src={game_frame} alt="" />
        <img className={styles.GameDescriptionCatImg} src={cat} alt="" />
        <img className={styles.GameDescriptionRabbitImg} src={rabbit} alt="" />
      </div>
    </div>
  );
};

export default GameDescription;
