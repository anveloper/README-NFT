import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import LogoImg from "../assets/logo_img.svg";
import LogoText from "../assets/logo_text.svg";
// components
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const [profileImg, setProfileImg] = useState(LogoImg);
  const [nameTag, setNameTag] = useState("피자먹는 라이언");
  const [modalOpen, setModalOpen] = useState(false);

  const showProfileModal = () => {
    setModalOpen(true);
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
        <Link to="/detail">
          <button>NFT상세</button>
        </Link>
        <Link to="/login">
          <button>로그인</button>
        </Link>
        <Link to="/mypage">
          <button>마이페이지</button>
        </Link>
      </div>
      <div className={styles.profileTag} onClick={showProfileModal}>
        {modalOpen && <ProfileModal setModalOpen={setModalOpen} />}
        <img src={profileImg} alt="" className={styles.avatar} />
        <p className={styles.nameTag}>{nameTag}</p>
      </div>
    </div>
  );
};

export default Navbar;
