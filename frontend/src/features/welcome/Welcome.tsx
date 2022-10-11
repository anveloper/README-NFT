import { useAppDispatch, useAppSelector } from "app/hooks";
import { useEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {
  login,
  selectCurrentChainId,
  selectUserAddress,
  setIsWelcome,
} from "features/auth/authSlice";
// component
import WelcomePageOne from "./components/WelcomePageOne";
import WelcomePageTwo from "./components/WelcomePageTwo";
import WelcomePageThree from "./components/WelcomePageThree";
import WelcomePageFour from "./components/WelcomePageFour";
import WelcomePageFive from "./components/WelcomePageFive";
import WelcomePageSix from "./components/WelcomePageSix";
// css
import styles from "./Welcome.module.css";
// img
import welcomeCharacter from "../../assets/welcome/welcome_character.svg";
import WelcomeNavbar from "./components/WelcomeNavbar";
import { getIntersectionObserver } from "./observer";
import WelcomePageEvent from "./components/WelcomePageEvent";
import { useNavigate } from "react-router-dom";
import { Modal } from "components/modal/Modal";

const Welcome = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectUserAddress);
  const onboarding = useRef<MetaMaskOnboarding>();
  const [welcomeNav, setWelcomeNav] = useState<number>(1);
  const [welcomeRef, setWelcomeRef] = useState<HTMLDivElement[]>([]);
  const welcomePageRef = useRef<HTMLDivElement | null>(null);
  const eventRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const readmeRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);
  const roadmapRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const chainId = useAppSelector(selectCurrentChainId);
  const [openConnectWalletModal, setOpenConnectWalletModal] = useState(false);
  const [openConnectNetModal, setOpenConnectNetModal] = useState(false);
  const [openInstallWalletModal, setOpenInstallWalletModal] = useState(false);

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    function handleNewAccounts(accounts: string[]) {
      if (accounts[0].length > 0) {
        console.log("accountsChaged");
        dispatch(login(accounts[0]));
      }
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts)
        .catch((error: any) => {
          if (error.code === 4001) {
            // alert("메타마스크의 계정과 연결해 주세요!");
            openConnectWalletAlertModal();
          }
        });
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (account) {
        onboarding.current.stopOnboarding();
      }
    }
  }, [account]);

  useEffect(() => {
    const observer = getIntersectionObserver(setWelcomeNav);

    const headers = [
      eventRef.current,
      storyRef.current,
      readmeRef.current,
      gameRef.current,
      roadmapRef.current,
      teamRef.current,
    ];

    headers.map((header) => {
      observer.observe(header);
    });
    setWelcomeRef(headers);
  }, []);

  const connectWallet = async () => {
    //메타마스크가 깔려있으면
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      console.log(chainId);
      if (chainId === "0x79f5" || chainId === "0x5") {
        dispatch(setIsWelcome(false));
      } else {
        openConnectNetworkAlertModal();
        // alert("싸피네트워크나 goerli네트워크에 연결해주세요!");
        // navigate("/guide");
      }
    } else {
      //안깔려 있으면 설치 유도
      // alert("메타마스크를 설치해 주세요!");
      // onboarding.current.startOnboarding();
      openInstallAlertModal();
    }
  };

  const openConnectWalletAlertModal = () => {
    setOpenConnectWalletModal(true);
  };

  const closeConnectWalletAlertModal = () => {
    setOpenConnectWalletModal(false);
  };

  const openConnectNetworkAlertModal = () => {
    setOpenConnectNetModal(true);
  };

  const closeConnectNetworkAlertModal = () => {
    setOpenConnectNetModal(false);
  };

  const openInstallAlertModal = () => {
    setOpenInstallWalletModal(true);
  };

  const closeInstallAlertModal = () => {
    setOpenInstallWalletModal(false);
  };

  return (
    <div className={styles.Welcome} ref={welcomePageRef}>
      <img
        className={styles.welcome_character}
        src={welcomeCharacter}
        alt=""
        onClick={connectWallet}
      />

      <WelcomeNavbar welcomeNav={welcomeNav} welcomeRef={welcomeRef} />
      <WelcomePageEvent onboarding={onboarding} eventRef={eventRef} />
      <WelcomePageOne storyRef={storyRef} />
      <WelcomePageTwo readmeRef={readmeRef} />
      <WelcomePageThree gameRef={gameRef} />
      <WelcomePageFour roadmapRef={roadmapRef} />
      <WelcomePageFive teamRef={teamRef} />
      <WelcomePageSix />

      <Modal
        open={openConnectWalletModal}
        close={closeConnectWalletAlertModal}
        header="메타마스크 연결"
        fn={closeConnectWalletAlertModal}
      >
        <div>메타마스크 계정과 연결해주세요!</div>
      </Modal>

      <Modal
        open={openConnectNetModal}
        close={closeConnectNetworkAlertModal}
        header="싸피 네트워크 연결"
        fn={() => navigate("/guide")}
      >
        <div>싸피 네트워크 또는 goerli 네트워크로 연결해주세요!</div>
      </Modal>

      <Modal
        open={openInstallWalletModal}
        close={closeInstallAlertModal}
        header="메타마스크 설치"
        fn={() => onboarding.current.startOnboarding()}
      >
        <div>메타마스크를 설치해 주세요!</div>
      </Modal>
    </div>
  );
};

export default Welcome;
