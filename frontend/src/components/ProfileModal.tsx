import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// img
import lion from "../assets/characters/lion.svg";
// css
import styles from "./Navbar.module.css";

const ProfileModal = ({ setModalOpen }: any) => {
  // 모달창 닫기
  const closeModal = () => {
    setModalOpen(false);
  };

  const navigate = useNavigate();
  const mypage = () => {
    navigate("/mypage");
    setModalOpen(false);
  };

  const modalRef = useRef<HTMLDivElement>(null);

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
    <div className={styles.ProfileModal} ref={modalRef}>
      <div className={styles.ProfileModalBackground}>
        <div className={styles.ProfileModalMyInfo}>
          {/* <button className={styles.ProfileModalCloseButton} onClick={closeModal}>X</button> */}
          <div className={styles.ProfileModalImgBox} onClick={mypage}>
            <img className={styles.ProfileModalImg} src={lion} alt="" />
          </div>

          <h2>Nickname</h2>
          <h5>Wallet Address</h5>
          <h1>1000 SSF</h1>
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
