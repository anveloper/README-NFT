import React, { useState } from "react";
import styles from "../Welcome.module.css";
import { useAppDispatch } from "../../../app/hooks";

// image
import palette from "../../../assets/palette.svg";
import { loginUser } from "../../auth/authSlice";

const WalletAddress = () => {
  const [loginUserAddress, setLoginUserAddress] = useState("");

  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    if (loginUserAddress.length > 0) {
      dispatch(loginUser(loginUserAddress));
    }
  };
  return (
    <div className={styles.WalletAddress}>
      <div className={styles.WalletAddressText}>
        <h2>내 마음을 읽어줘!</h2>
        <h6>Draw, then mint!</h6>
      </div>
      <div className={styles.WalletAddressBox}>
        <img className={styles.WalletAddressPallete} src={palette} alt="" />
        <div className={styles.WalletAddressRegister}>
          <input
            type="text"
            value={loginUserAddress}
            onChange={(e) => {
              setLoginUserAddress(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button onClick={handleSubmit}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default WalletAddress;
