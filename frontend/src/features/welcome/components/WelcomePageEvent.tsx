// components
import NFTCard from "./NFTCard";
// css
import styles from "../Welcome.module.css";
// img
import dog from "../../../assets/nft-img/1.png";
import { DrawTokenContract } from "web3Config";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "app/hooks";
import { selectUserAddress } from "features/auth/authSlice";
import MetaMaskOnboarding from "@metamask/onboarding";

const WelcomePageEvent = () => {
  const account = useAppSelector(selectUserAddress);
  const [eventLeft, setEventLeft] = useState(0);
  const onboarding = useRef<MetaMaskOnboarding>();

  useEffect(() => {
    DrawTokenContract.methods.getWinnerCount().call(({ err, res }: any) => {
      setEventLeft(res);
      console.log(res);
    });
  }, []);

  const getEventMoney = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x79F5" }],
        });
        await DrawTokenContract.methods
          .shareToken()
          .send({ from: account }, ({ receipt, error }: any) => {
            console.log(receipt);
            console.log(error);
          });
      } catch {
        alert("가이드에 따라 ssafy 네트워크를 추가해 주세요!");
      }
    } else {
      //안깔려 있으면 설치 유도
      onboarding.current.startOnboarding();
    }
    DrawTokenContract.methods.getWinnerCount().call(({ err, res }: any) => {
      setEventLeft(res);
    });
  };

  return (
    <div className={styles.welcomePageEvent}>
      <h1 className={styles.WelcomeTitleText}>선착순 이벤트에 참여해보세요!</h1>
      <h4 className={styles.WelcomeDescriptionText}>
        리드미 특별제작 NFT와, NFT를 구매할 수 있는 1000 SSF를 받아가세요!
      </h4>

      <div className={styles.eventNFT}>
        <NFTCard
          img={dog}
          name="특별제작 방태"
          creater="README"
          owner="피자먹는 방태"
        />
      </div>

      <p className={styles.eventSSF}> 💰 </p>

      <button onClick={getEventMoney} className={styles.eventButton}>
        이벤트 참여하기
      </button>
    </div>
  );
};

export default WelcomePageEvent;
