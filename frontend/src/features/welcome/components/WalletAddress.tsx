import React, { useEffect, useState } from "react";
import styles from "../Welcome.module.css";
import { useAppDispatch } from "../../../app/hooks";

// image
import palette from "../../../assets/palette.svg";
import { loginUser } from "../../auth/authSlice";
import metamask from "../../../assets/metamask.svg";
import { useNavigate } from "react-router-dom";
declare let window: any;

const WalletAddress = () => {
  // const [loginUserAddress, setLoginUserAddress] = useState("");
  const dispatch = useAppDispatch();

  const [account, setAccount] = useState<string>("");
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        if (accounts[0].length > 0) {
          dispatch(loginUser(accounts[0]));
        }
        console.log(accounts);
        navigate("/");
      } else {
        alert("Install Metamask!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  useEffect(() => {
    console.log(account);
  }, [account]);

  return (
    <div className={styles.WalletAddress}>
      <div className={styles.WalletAddressText}>
        <h2>내 마음을 읽어줘!</h2>
        <h6>Draw, then mint!</h6>
      </div>
      <div className={styles.WalletAddressBox}>
        <img className={styles.WalletAddressPallete} src={palette} alt="" />
        <div className={styles.WalletAddressRegister}>
          {/* <input
            type="text"
            value={loginUserAddress}
            onChange={(e) => {
              setLoginUserAddress(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <button onClick={handleSubmit}>등록</button> */}
          <button onClick={connectWallet}>
            <img className={styles.metamaskImg} src={metamask} alt="" />
            Metamask로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletAddress;
