import { Link } from "react-scroll";
// css
import styles from "../Welcome.module.css";
// image
import LogoImg from "../../../assets/logo_img.svg";
import LogoText from "../../../assets/logo_text.svg";

const WelcomeNavbar = () => {
  return (
    <div className={styles.WelcomeNavbar}>
      <img className={styles.logo_img} src={LogoImg} alt="" />
      <img className={styles.logo_text_img} src={LogoText} alt="" />
      <div className={styles.WelcomeNavbarLink}>
        <Link to="story" spy={true} smooth={true}>
          <h5 className={styles.WelcomeNavbarText}>STORY</h5>
        </Link>
        <Link to="game" spy={true} smooth={true}>
          <h5 className={styles.WelcomeNavbarText}>GAME</h5>
        </Link>
        <Link to="roadmap" spy={true} smooth={true}>
          <h5 className={styles.WelcomeNavbarText}>ROADMAP</h5>
        </Link>
        <Link to="team" spy={true} smooth={true}>
          <h5 className={styles.WelcomeNavbarText}>TEAM</h5>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeNavbar;
