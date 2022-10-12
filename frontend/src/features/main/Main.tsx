// core
import { useState, useEffect, useRef, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
// state
import { setRoomInfo } from "../game/gameSlice";
import { selectIsSSAFY, selectUserAddress, selectUserName } from "../auth/authSlice";
import RoomButton from "./components/RoomButton";
// component
import NewHelmet from "../../components/NewHelmet";
import Carousel from "./components/Carousel";
import MainTab from "./components/MainTab";
import { Modal } from "../../components/modal/Modal";
// css
import styles from "./Main.module.css";
import Guide from "./Guide";
import { SocketContext } from "../../socketConfig";
import { findSolveList, setRawList } from "../nft/nftSlice";
import { GetReadmeContract, GetReadmeContractGO } from "../../web3Config";
import SaleButton from "./components/SaleButton";
import { getIntersectionObserver } from "./observer";
import MainNav from "./components/MainNav";

const Main = ({ mainRef }: any) => {
  const socket = useContext(SocketContext);
  const userAddress = useAppSelector(selectUserAddress);
  const userName = useAppSelector(selectUserName);

  const guideRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [registerRoomName, setRegisterRoomName] = useState("");

  const [under, setUnder] = useState("left");
  const [mainNav, setMainNav] = useState<number>(1);
  const [mainNavRef, setMainNavRef] = useState<HTMLDivElement[]>([]);
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  useEffect(() => {
    if (isSSAFY) {
      GetReadmeContract.methods.getTotalToken().call((err: any, res: any) => {
        dispatch(setRawList(res));
      });
    } else {
      GetReadmeContractGO.methods.getTotalToken().call((err: any, res: any) => {
        dispatch(setRawList(res));
      });
    }
    dispatch(findSolveList(userAddress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(findSolveList(userAddress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  const closeModal = () => {
    setModalOpen(false);
    setRegisterRoomName("");
  };

  const handleEnterRoom = () => {
    if (socket) {
      socket.emit("enter_room", userAddress, userName, registerRoomName, (room: string, cnt: number, host: any, data: string) => {
        setModalOpen(false);
        setRegisterRoomName("");
        dispatch(
          setRoomInfo({
            roomName: room,
            roomCnt: cnt,
            hostUserName: host,
            answerLength: 0,
            participants: JSON.parse(data),
          })
        );
        navigator(`/game/${host}`);
      });
    }
  };
  useEffect(() => {
    const observer = getIntersectionObserver(setMainNav);
    const headers = [guideRef.current, carouselRef.current, tabRef.current];

    // eslint-disable-next-line array-callback-return
    headers.map((header) => {
      observer.observe(header);
    });
    setMainNavRef(headers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={mainRef} className={styles.mainContainer}>
      <NewHelmet title="리드미 & NFT" description="README 게임 라이브 목록 및 NFT 목록을 보여줍니다." />
      <MainNav obsNumber={mainNav} mainRef={mainNavRef} under={under} setUnder={setUnder} />
      <Guide guideRef={guideRef} />
      <Carousel carouselRef={carouselRef} />
      <MainTab tabRef={tabRef} under={under} setUnder={setUnder} />
      <Outlet />
      <Modal open={modalOpen} close={closeModal} fn={handleEnterRoom} header="내 마음을 읽어줘 - 방 만들기">
        <div className={styles.modalBox}>
          <div className={styles.modalText}>
            <p>생성할 방의 이름을 입력하세요!</p>
          </div>
          <input
            className={styles.modalInput}
            type="text"
            value={registerRoomName}
            onChange={(e) => {
              setRegisterRoomName(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleEnterRoom();
              }
            }}
          />
          <div className={styles.modalText_small}>
            게임 방법이 궁금하다면?
            <Link to="/tutorial">
              <button className={styles.tutoBtn}>튜토리얼</button>
            </Link>
          </div>
        </div>
      </Modal>
      <SaleButton />
      {socket && socket.connected && <RoomButton setModalOpen={setModalOpen} />}
      <div
        style={{
          width: "100%",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Copyright © NFTeam All Rights Reserved.
      </div>
    </div>
  );
};

export default Main;
