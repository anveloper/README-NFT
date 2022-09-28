import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
// img
import lion from "../assets/characters/lion.svg";
import { selectUserAddress, selectUserName } from "../features/auth/authSlice";
import { SSFContract } from "../web3Config";
// css
import styles from "./Navbar.module.css";

interface ProfileModalProps {
  closeProfileModal: () => void;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileModal: FC<ProfileModalProps> = ({
  closeProfileModal,
  modalOpen,
  setModalOpen,
}) => {
  const walletAddress = useAppSelector(selectUserAddress);
  const nickname = useAppSelector(selectUserName);
  const [balance, setBalance] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const getBalance = async () => {
    try {
      const SSFbalance = await SSFContract.methods
        .balanceOf(walletAddress)
        .call();
      setBalance(SSFbalance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // console.log("modalOpen : ", modalOpen);
    getBalance();
  });

  useEffect(() => {
    console.log("change balance : ", balance);
    setBalance(balance);
  }, [balance]);

  // 모달창 닫기
  const closeModal = () => {
    setModalOpen(false);
  };

  const navigate = useNavigate();
  const mypage = () => {
    navigate("/mypage");

    // setModalOpen(false);
    closeProfileModal();

    console.log("myPage ; ", modalOpen);
  };

  useEffect(() => {
    const handler = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    // 모바일 대응
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <div
      className={
        modalOpen
          ? `${styles.ProfileModal} ${styles.ProfileModalOpen}`
          : `${styles.ProfileModal} ${styles.ProfileModalClose}`
      }
      ref={modalRef}
    >
      <div className={styles.ProfileModalBackground}>
        <div className={styles.ProfileModalMyInfo}>
          <button
            className={styles.ProfileModalCloseButton}
            onClick={closeModal}
          >
            Close
          </button>
          <div className={styles.ProfileModalTextBox}>
            <div className={styles.ProfileModalImgBox} onClick={mypage}>
              <img className={styles.ProfileModalImg} src={lion} alt="" />
            </div>

            <h2 style={{ marginTop: "1rem" }}>{nickname}</h2>
            <h5 style={{ marginTop: "0.5em" }}>{walletAddress}</h5>
            <h1 style={{ marginTop: "0.2em" }}>{balance} SSF</h1>
          </div>
        </div>

        <div className={styles.ProfileModalNotification}>
          <div className={styles.ProfileModalNotificationText}>
            <p>보유하신 '귓속말'의 판매가 완료되었습니다.</p>
            <button className={styles.ProfileModalNotificationTextDelete}>
              X
            </button>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
