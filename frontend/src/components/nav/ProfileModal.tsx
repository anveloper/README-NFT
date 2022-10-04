import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import io from "socket.io-client";
// img
import {
  selectUserAddress,
  selectUserAvatar,
  selectUserName,
} from "../../features/auth/authSlice";
import { SSFContract } from "../../web3Config";
// css
import styles from "./Navbar.module.css";
import useNotification from "./Notification";
import { SocketContext } from "socketConfig";

interface ProfileModalProps {
  modalOpen: boolean;
  showModal: () => void;
}

const ProfileModal: FC<ProfileModalProps> = ({ modalOpen, showModal }) => {
  const userAvater = useAppSelector(selectUserAvatar);
  const walletAddress = useAppSelector(selectUserAddress);
  const nickname = useAppSelector(selectUserName);
  const [balance, setBalance] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const socket = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);

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

  const handler = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      showModal();
    }
  };
  const closeModal = () => {
    showModal();
  };
  const navigate = useNavigate();
  const mypage = () => {
    navigate("/mypage");
    showModal();
  };

  const triggerNotif = useNotification("Test Noti", {
    body: "notification body test",
  });

  useEffect(() => {
    if (modalOpen) document.addEventListener("mousedown", handler);
    else document.removeEventListener("mousedown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  useEffect(() => {
    socket.emit("newUser", walletAddress);
  }, [socket, walletAddress]);

  useEffect(() => {
    socket.on("getNotification", (data: any) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  console.log(notifications);

  const displayNotification = (nftName: any) => {
    return (
      <p className="notification">{`보유하신 '${nftName}'의 판매가 완료되었습니다`}</p>
    );
  };

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
              <img className={styles.ProfileModalImg} src={userAvater} alt="" />
            </div>

            <h2 style={{ marginTop: "1rem" }}>{nickname}</h2>
            <h5 style={{ marginTop: "0.5em" }}>{walletAddress}</h5>
            <h1 style={{ marginTop: "0.2em" }}>{balance} SSF</h1>
          </div>
        </div>

        <div className={styles.ProfileModalNotification}>
          <button onClick={triggerNotif}>Push Notification</button>
          <div className={styles.ProfileModalNotificationText}>
            {notifications.map((n) => displayNotification(n))}
            {/* <p>보유하신 '귓속말'의 판매가 완료되었습니다.</p> */}
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
