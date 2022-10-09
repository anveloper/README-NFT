// components
import NFTCard from "./NFTCard";
// css
import styles from "../Welcome.module.css";
// img
import dog from "../../../assets/nft-img/1.png";
import eventSSF from "assets/welcome/eventMoney.svg";
import eventInfo from "assets/welcome/eventInfo.svg";
import { DrawTokenContract } from "web3Config";
import { useEffect, useState } from "react";
import { useAppSelector } from "app/hooks";
import {
  selectCurrentChainId,
  selectIsSSAFY,
  selectUserAddress,
} from "features/auth/authSlice";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useNavigate } from "react-router-dom";
import LoadingPage from "components/loading/LoadingPage";
const WelcomePageEvent = ({ onboarding, eventRef }: any) => {
  const account = useAppSelector(selectUserAddress);
  const [eventLeft, setEventLeft] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const chainId = useAppSelector(selectCurrentChainId);
  useEffect(() => {
    if (isSSAFY) {
      DrawTokenContract.methods.getWinnerCount().call((err: any, res: any) => {
        setEventLeft(res);
      });
    }
  }, [chainId]);

  const isTokenImported = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: process.env.REACT_APP_ERC20_CA, // The address that the token is at.
            symbol: "SSF", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 0,
          },
        },
      });
      if (wasAdded) {
        // console.log("Thanks for your interest!");
      } else {
        // console.log("Your loss!");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const getEventMoney = async () => {
    let userRejected = false;
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setLoading(true);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x79F5" }],
        });
      } catch {
        setLoading(false);
        alert("가이드에 따라 ssafy 네트워크를 추가해 주세요!");
        navigate(`/guide`);
      }
      try {
        await DrawTokenContract.methods
          .shareToken()
          .estimateGas({ from: account });
        // .then((gasAmount: any) => {
        //   console.log(gasAmount);
        // });
        await DrawTokenContract.methods
          .shareToken()
          .send({ from: account }, (error: any, receipt: any) => {
            // console.log(receipt);
            if (error && error.code === 4001) {
              userRejected = true;
            }
            setLoading(false);
          });
      } catch {
        if (!userRejected) {
          alert("이미 참여한 계정입니다!");
        }
        setLoading(false);
      }
    } else {
      //안깔려 있으면 설치 유도
      alert("메타마스크를 설치해 주세요!");
      onboarding.current.startOnboarding();
    }
    DrawTokenContract.methods.getWinnerCount().call((err: any, res: any) => {
      setEventLeft(res);
    });
  };

  return (
    <div className={styles.welcomePageEvent} ref={eventRef}>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <h1 className={styles.WelcomeTitleText}>
            선착순 이벤트에 참여해보세요!
          </h1>
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

          <p className={styles.eventText}>
            {eventLeft && isSSAFY
              ? `${eventLeft}명 남았습니다! 서두르세요!`
              : `먼저 SSAFY 네트워크에 연결해 주세요!`}
          </p>
          <img className={styles.eventSSF} src={eventSSF} alt="" />

          <button className={styles.eventButton} onClick={getEventMoney}>
            이벤트 참여하기
          </button>
          <button className={styles.importSSFButton} onClick={isTokenImported}>
            <img className={styles.eventInfo} src={eventInfo} alt="" />
            지갑에 SSAFY 토큰(SSF) 추가하기!
          </button>
        </>
      )}
    </div>
  );
};

export default WelcomePageEvent;
