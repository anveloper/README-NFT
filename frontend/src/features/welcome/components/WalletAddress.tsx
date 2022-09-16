import styles from "../Welcome.module.css";

// image
import palette from "../../../assets/palette.svg";

const WalletAddress = () => {
  return (
    <div className={styles.WalletAddress}>
      <div className={styles.WalletAddressText}>
        <h2>내 마음을 읽어줘!</h2>
        <h6>Draw, then mint!</h6>
      </div>
      <div className={styles.WalletAddressBox}>
        <img className={styles.WalletAddressPallete} src={palette} alt="" />
        <div className={styles.WalletAddressRegister}>
          <input type="text" />
          <button>등록</button>
        </div>
      </div>
    </div>
  );
};

export default WalletAddress;
