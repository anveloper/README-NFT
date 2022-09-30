import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import LogoImg from "../assets/logo_img.svg";
import LogoText from "../assets/logo_text.svg";
// components
import ProfileModal from "./ProfileModal";
import { useAppSelector } from "app/hooks";
import { selectUserAvatar, selectUserName } from "features/auth/authSlice";

const Navbar = () => {
  const [profileImg, setProfileImg] = useState(LogoImg);
  const userAvatar = useAppSelector(selectUserAvatar);
  const [nameTag, setNameTag] = useState("피자먹는 라이언");
  const [modalOpen, setModalOpen] = useState(false);
  const nickname = useAppSelector(selectUserName);

  const showProfileModal = () => {
    setModalOpen(true);
  };

  const closeProfileModal = () => {
    setModalOpen(false);
    console.log("closeProfileModal : ", modalOpen);
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.logoBox}>
        <Link to="/">
          <img className={styles.img} src={LogoImg} alt="" />
          <img className={styles.img} src={LogoText} alt="" />
        </Link>
      </div>
      <div className={styles.navButtonBox}>
        <Link to="/sale">
          <button>NFT 판매</button>
        </Link>
        <Link to="/login">
          <button>로그인</button>
        </Link>
        <Link to="/mypage">
          <button>마이페이지</button>
        </Link>
        <Link to="/test">
          <button>테스트페이지</button>
        </Link>
      </div>
      <div className={styles.profileTag} onClick={showProfileModal}>
        {modalOpen && (
          <ProfileModal
            closeProfileModal={closeProfileModal}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        )}
        <img src={userAvatar} alt="" className={styles.avatar} />
        <p className={styles.nameTag}>{nickname}</p>
      </div>
    </div>
  );
};

export default Navbar;
