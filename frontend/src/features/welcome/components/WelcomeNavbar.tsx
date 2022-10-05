// css
import styles from "../Welcome.module.css";
// image
import LogoImg from "../../../assets/logo_img.svg";
import LogoText from "../../../assets/logo_text.svg";
interface WelcomeNavbarProps {
  welcomeNav: number;
  welcomeRef: HTMLDivElement[];
}
const WelcomeNavbar = ({ welcomeNav, welcomeRef }: WelcomeNavbarProps) => {
  return (
    <div className={styles.WelcomeNavbar}>
      <img className={styles.logo_img} src={LogoImg} alt="" />
      <img className={styles.logo_text_img} src={LogoText} alt="" />
      <div className={styles.WelcomeNavbarLink}>
        <h5
          style={welcomeNav == 2 ? { color: "#fddf61" } : {}}
          className={styles.WelcomeNavbarText}
          onClick={() => {
            welcomeRef[0].scrollIntoView({ behavior: "smooth" });
          }}
        >
          STORY
        </h5>
        <h5
          style={welcomeNav == 3 ? { color: "#fddf61" } : {}}
          className={styles.WelcomeNavbarText}
          onClick={() => {
            welcomeRef[1].scrollIntoView({ behavior: "smooth" });
          }}
        >
          GAME
        </h5>

        <h5
          style={welcomeNav == 4 ? { color: "#fddf61" } : {}}
          className={styles.WelcomeNavbarText}
          onClick={() => {
            welcomeRef[2].scrollIntoView({ behavior: "smooth" });
          }}
        >
          ROADMAP
        </h5>

        <h5
          style={welcomeNav == 5 ? { color: "#fddf61" } : {}}
          className={styles.WelcomeNavbarText}
          onClick={() => {
            welcomeRef[3].scrollIntoView({ behavior: "smooth" });
          }}
        >
          TEAM
        </h5>
      </div>
    </div>
  );
};

export default WelcomeNavbar;
