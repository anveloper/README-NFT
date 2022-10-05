import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import LogoImg from "../../assets/logo_img.svg";
import LogoText from "../../assets/logo_text.svg";
// components
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  selectUserAddress,
  selectUserAvatar,
  selectUserName,
  setIsWelcome,
} from "features/auth/authSlice";

const isDev = process.env.NODE_ENV !== "production";

const Navbar = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const userAvatar = useAppSelector(selectUserAvatar);
  const [modalOpen, setModalOpen] = useState(false);
  const nickname = useAppSelector(selectUserName);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.navBar}>
      <div className={styles.logoBox}>
        <Link to="/">
          <img className={styles.img1} src={LogoImg} alt="" />
          <img className={styles.img2} src={LogoText} alt="" />
        </Link>
      </div>
      {isDev && (
        <div className={styles.navButtonBox}>
          <Link to="/login">
            <button>로그인</button>
          </Link>
          <Link to="/mypage">
            <button>마이페이지</button>
          </Link>
          <Link to="/test">
            <button>테스트페이지</button>
          </Link>
          <button
            onClick={() => {
              dispatch(setIsWelcome());
            }}
          >
            웰컴페이지
          </button>
          {"개발때만 보여요."}
        </div>
      )}
      <div
        className={
          modalOpen
            ? `${styles.profileTag} ${styles.active}`
            : `${styles.profileTag}`
        }
        onClick={() => {
          setModalOpen(!modalOpen);
          navigate("/mypage");
        }}
      >
        <img src={userAvatar} alt="" className={styles.avatar} />
        {!modalOpen && <p className={styles.nameTag}>{nickname}</p>}
      </div>
    </div>
  );
};

export default Navbar;
