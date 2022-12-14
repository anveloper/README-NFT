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
import { Modal } from "components/modal/Modal";
const WelcomePageEvent = ({ onboarding, eventRef }: any) => {
  const account = useAppSelector(selectUserAddress);
  const [eventLeft, setEventLeft] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const chainId = useAppSelector(selectCurrentChainId);
  const [netModalOpen, setNetModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  useEffect(() => {
    if (isSSAFY) {
      DrawTokenContract.methods.getWinnerCount().call((err: any, res: any) => {
        setEventLeft(res);
      });
    }
  }, [chainId]);

  const openNetModal = () => {
    setNetModalOpen(true);
  };

  const openEventModal = () => {
    setEventModalOpen(true);
  };

  const openInstallModal = () => {
    setInstallModalOpen(true);
  };

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
        // alert("???????????? ?????? ssafy ??????????????? ????????? ?????????!");
        // navigate(`/guide`);
        openNetModal();
        return;
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
          // alert("?????? ????????? ???????????????!");
          openEventModal();
        }
        setLoading(false);
      }
    } else {
      //????????? ????????? ?????? ??????
      // alert("?????????????????? ????????? ?????????!");
      // onboarding.current.startOnboarding();
      openInstallModal();
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
            ????????? ???????????? ??????????????????!
          </h1>
          <h4 className={styles.WelcomeDescriptionText}>
            ????????? ???????????? NFT???, NFT??? ????????? ??? ?????? 1000 SSF??? ???????????????!
          </h4>

          <div className={styles.eventNFT}>
            <NFTCard
              img={dog}
              name="???????????? ??????"
              creater="README"
              owner="???????????? ??????"
            />
          </div>

          <p className={styles.eventText}>
            {eventLeft && isSSAFY
              ? `${eventLeft}??? ???????????????! ???????????????!`
              : `?????? SSAFY ??????????????? ????????? ?????????!`}
          </p>
          <img className={styles.eventSSF} src={eventSSF} alt="" />

          <button className={styles.eventButton} onClick={getEventMoney}>
            ????????? ????????????
          </button>
          <button className={styles.importSSFButton} onClick={isTokenImported}>
            <img className={styles.eventInfo} src={eventInfo} alt="" />
            ????????? SSAFY ??????(SSF) ????????????!
          </button>
        </>
      )}
      <Modal
        open={netModalOpen}
        close={() => setNetModalOpen(false)}
        header="?????? ???????????? ??????"
        fn={() => {
          setNetModalOpen(false);
          navigate("/guide");
        }}
      >
        <div>???????????? ?????? ssafy ??????????????? ????????? ?????????!</div>
      </Modal>
      <Modal
        open={eventModalOpen}
        close={() => setEventModalOpen(false)}
        header="????????? ?????? ??????"
        fn={() => setEventModalOpen(false)}
      >
        <div>?????? ????????? ???????????????!</div>
      </Modal>
      <Modal
        open={installModalOpen}
        close={() => setInstallModalOpen(false)}
        header="??????????????? ??????"
        fn={() => {
          setInstallModalOpen(false);
          onboarding.current.startOnboarding();
        }}
      >
        <div>?????????????????? ????????? ?????????!</div>
      </Modal>
    </div>
  );
};

export default WelcomePageEvent;
