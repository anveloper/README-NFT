import { useAppDispatch } from "app/hooks";
import { useEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { login } from "features/auth/authSlice";
// component
import WelcomeNavbar from "./components/WelcomeNavbar";
import WalletAddress from "./components/WalletAddress";
import NFTDescription from "./components/NFTDescription";
import GameDescription from "./components/GameDescription";
import RoadMap from "./components/RoadMap";
import Developers from "./components/Developers";
// css
import styles from "./Welcome.module.css";
import WelcomePageStart from "./components/WelcomePageStart";
import WelcomePageTwo from "./components/WelcomePageTwo";
import WelcomePageThree from "./components/WelcomePageThree";
import WelcomePageFour from "./components/WelcomePageFour";
import WelcomePageFive from "./components/WelcomePageFive";
import WelcomePageSix from "./components/WelcomePageSix";
// img
import welcome_character from "../../assets/welcome/welcome_character.svg";

const Welcome = () => {
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
    <div className={styles.Welcome}>
      {/* <WelcomeNavbar /> */}
      <img
        className={styles.welcome_character}
        src={welcome_character}
        alt=""
        onClick={connectWallet}
      />
      <WelcomePageSix />
      <WelcomePageFive />
      <WelcomePageFour />
      <WelcomePageThree />
      <WelcomePageTwo />
      <WelcomePageStart />

      {/* <WalletAddress />

      <NFTDescription />

      <GameDescription />

      <RoadMap />

      <Developers /> */}
    </div>
  );
};

export default Welcome;
