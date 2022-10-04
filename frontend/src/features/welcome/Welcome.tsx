import { useAppDispatch } from "app/hooks";
import { useEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { login } from "features/auth/authSlice";
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
import { getIntersectionObserver } from "features/main/observer";
import WelcomePageEvent from "./components/WelcomePageEvent";

const Welcome = () => {
  const dispatch = useAppDispatch();
  const [accounts, setAccounts] = useState<string[]>([]);
  const onboarding = useRef<MetaMaskOnboarding>();
  const ref = useRef();

  const [welcomeNav, setWelcomeNav] = useState<number>(1);
  const [welcomeRef, setWelcomeRef] = useState<HTMLDivElement[]>([]);
  const welcomePageRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);
  const roadmapRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const observer = getIntersectionObserver(setWelcomeNav);

    const headers = [
      storyRef.current,
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
    // <Parallax ref={ref} pages={6}>
    <div className={styles.Welcome} ref={welcomePageRef}>
      {/* <ParallaxLayer offset={0} speed={1} factor={6}> */}
      <img
        className={styles.welcome_character}
        src={welcomeCharacter}
        alt=""
        onClick={connectWallet}
      />

      <WelcomeNavbar welcomeNav={welcomeNav} welcomeRef={welcomeRef} />

      {/* <ScrollPage /> */}
      {/* </ParallaxLayer> */}

      {/* <ParallaxLayer offset={0} speed={-1} factor={1.5}> */}

      <WelcomePageEvent />

      <WelcomePageOne />

      {/* </ParallaxLayer> */}

      {/* <ParallaxLayer offset={1} speed={-1} factor={1.5}> */}
      {/* <div id="story"> */}
      <WelcomePageTwo storyRef={storyRef} />
      {/* </div> */}
      {/* </ParallaxLayer> */}

      {/* <ParallaxLayer offset={2} speed={0.1} factor={1.5}> */}
      {/* <div id="game"> */}
      <WelcomePageThree gameRef={gameRef} />
      {/* </div> */}
      {/* </ParallaxLayer> */}

      {/* <ParallaxLayer offset={3} speed={0.1} factor={1.5}> */}
      {/* <div id="roadmap"> */}
      <WelcomePageFour roadmapRef={roadmapRef} />
      {/* </div> */}
      {/* </ParallaxLayer> */}

      {/* <ParallaxLayer offset={4} speed={0.1} factor={1.5}> */}
      {/* <div id="team"> */}
      <WelcomePageFive teamRef={teamRef} />
      {/* </div> */}
      {/* </ParallaxLayer> */}

      {/* <ParallaxLayer offset={5} speed={0.1} factor={1.5}> */}
      <WelcomePageSix />
      {/* </ParallaxLayer> */}
    </div>
    // </Parallax>
  );
};

export default Welcome;
