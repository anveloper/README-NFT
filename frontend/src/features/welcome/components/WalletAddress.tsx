import { useEffect, useState, useRef } from "react";
import styles from "../Welcome.module.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";

// image
import palette from "../../../assets/palette.svg";
import { login, loginUser } from "../../auth/authSlice";
import metamask from "../../../assets/metamask.svg";
declare let window: any;

const WalletAddress = () => {
  const dispatch = useAppDispatch();
  const [accounts, setAccounts] = useState<string[]>([]);
  const onboarding = useRef<MetaMaskOnboarding>();
  //메타마스트 onboarding객체 생성
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  //접속시 깔려 있으면 account state
  useEffect(() => {
    function handleNewAccounts(newAccounts: string[]) {
      setAccounts(newAccounts);
      console.log(accounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        onboarding.current.stopOnboarding();
      }
    }
  }, [accounts]);

  const connectWallet = async () => {
    //메타마스크가 깔려있으면
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x79F5" }],
        });
        dispatch(login(accounts[0]));
      } catch {
        alert("가이드에 따라 ssafy 네트워크를 추가해 주세요!");
      }
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
