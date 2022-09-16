// image
import lion from "../../../assets/characters/lion.svg";
// css
import styles from "../MyPage.module.css";

const MyNFTCard = () => {
  return (
    <div className={styles.MyNFTCard}>
      <img src={lion} alt="" />

      <div>
        <h4>NFT Name</h4>
        <p>Creater</p>
      </div>

      <div>
        <h5>22 SSF</h5>
        <p>First Solver</p>
      </div>
    </div>
  );
};

export default MyNFTCard;
