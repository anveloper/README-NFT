// core
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
// state
import { setRoomInfo } from "../game/gameSlice";
import { selectUserAddress, selectUserName } from "../auth/authSlice";
import RoomButton from "./components/RoomButton";
// component
import NewHelmet from "../../components/NewHelmet";
import Carousel from "./components/Carousel";
import MainTab from "./components/MainTab";
import { Modal } from "../../components/modal/Modal";
// css
import styles from "./Main.module.css";
import Guide from "./Guide";
import { throttle } from "lodash";
import { reload, SocketContext } from "../../socketConfig";
import { findSolveList, setRawList } from "../nft/nftSlice";
import { GetReadmeContract } from "../../web3Config";
import SaleButton from "./components/SaleButton";

const Main = () => {
  const socket = useContext(SocketContext);
  const userAddress = useAppSelector(selectUserAddress);
  const userName = useAppSelector(selectUserName);

  const mainRef = useRef<HTMLDivElement | null>(null);
  const guideRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  const [view, setView] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [registerRoomName, setRegisterRoomName] = useState("");

  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  useEffect(() => {
    GetReadmeContract.methods.getTotalToken().call((err: any, res: any) => {
      dispatch(setRawList(res));
    });
    dispatch(findSolveList(userAddress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(findSolveList(userAddress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);
  useEffect(() => {
    if (!socket) {
      reload();
      console.log("reload");
    } else {
      console.log("연결된 소켓 정보", socket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const throttleWheel = useMemo(
    () =>
      throttle((value: number) => {
        // console.log(value);
        if (value > 0 && view < 7) setView(view + 1);
        else if (value > 0 && view === 7) return;
        else if (value < 0 && view >= 0) setView(view - 1);
      }, 200),
    [view]
  );

  const wheelAction = useCallback(
    (e: WheelEvent) => {
      const delY = e.deltaY;
      // if (Math.abs(delY) > 300) e.preventDefault();
      throttleWheel(delY);
    },
    [throttleWheel]
  );

  useEffect(() => {
    if (view <= 0)
      guideRef.current.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    else if (view >= 1 && view < 3)
      carouselRef.current.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    else if (view >= 3 && view < 5)
      tabRef.current.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    else if (view >= 5 && view < 7)
      mainRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    else return;
  }, [view]);

  useEffect(() => {
    mainRef?.current.addEventListener("wheel", wheelAction);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mainRef?.current?.removeEventListener("wheel", wheelAction);
    };
  });

  const closeModal = () => {
    setModalOpen(false);
    setRegisterRoomName("");
  };
  const handleEnterRoom = () => {
    if (socket) {
      socket.emit(
        "enter_room",
        userAddress,
        userName,
        registerRoomName,
        (room: string, cnt: number, host: any, data: string) => {
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
        }
      );
    }
  };
  return (
    <div ref={mainRef}>
      <NewHelmet
        title="리드미 & NFT"
        description="README 게임 라이브 목록 및 NFT 목록을 보여줍니다."
      />
      <Guide guideRef={guideRef} />
      <Carousel carouselRef={carouselRef} />
      <MainTab tabRef={tabRef} />
      <Outlet />
      <div ref={contentRef} />
      <Modal
        open={modalOpen}
        close={closeModal}
        fn={handleEnterRoom}
        header="내 마음을 읽어줘 - 방 만들기"
      >
        <div className={styles.modalBox}>
          <p className={styles.modalText}>방제목 : </p>
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
        </div>
      </Modal>
      <SaleButton />
      {socket && socket.connected && <RoomButton setModalOpen={setModalOpen} />}
    </div>
  );
};

export default Main;
