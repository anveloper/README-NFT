import React, { useEffect, useState, useRef } from "react";
import styles from "../Welcome.module.css";
import { useAppDispatch } from "../../../app/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";

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
  const onboarding = useRef<MetaMaskOnboarding>();

  //메타마스트 onboarding객체 생성
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  //접속시 깔려 있으면 account state
  useEffect(() => {
    function handleNewAccounts(newAccounts: string) {
      setAccount(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  useEffect(() => {
    console.log(account);
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (account.length > 0) {
        onboarding.current.stopOnboarding();
      } else {
      }
    }
  }, [account]);

  const connectWallet = async () => {
    //메타마스크가 깔려있으면
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: string) => setAccount(newAccounts));
    } else {
      //안깔려 있으면 설치 유도
      onboarding.current.startOnboarding();
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
