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
        <h5 className={styles.WelcomeNavbarText}>STORY</h5>

        <h5 className={styles.WelcomeNavbarText}>GAME</h5>

        <h5 className={styles.WelcomeNavbarText}>ROADMAP</h5>

        <h5 className={styles.WelcomeNavbarText}>TEAM</h5>
      </div>
    </div>
  );
};

export default WelcomeNavbar;
