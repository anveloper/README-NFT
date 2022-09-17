// components
import DeveloperInfo from "./DeveloperInfo";
// image
import cat from "../../../assets/characters/cat.svg";
import dog from "../../../assets/characters/dog.svg";
import giraffe from "../../../assets/characters/giraffe.svg";
import lion from "../../../assets/characters/lion.svg";
import rabbit from "../../../assets/characters/rabbit.svg";
import sheep from "../../../assets/characters/sheep.svg";
// css
import styles from "../Welcome.module.css";

const Developers = () => {
  return (
    <div className={styles.Developers}>
      <h2>개발자를 소개합니다!</h2>
      <div className={styles.DevelopersInfo}>
        <div className={styles.DeveloperSort}>
          <DeveloperInfo developer_img={cat} developer_info="BE | 김우원" />
          <DeveloperInfo developer_img={dog} developer_info="BE | 박시원" />
          <DeveloperInfo developer_img={giraffe} developer_info="BE | 이현정" />
        </div>

        <div className={styles.DeveloperSort}>
          <DeveloperInfo developer_img={lion} developer_info="FE | 강정현" />
          <DeveloperInfo developer_img={rabbit} developer_info="FE | 김주연" />
          <DeveloperInfo developer_img={sheep} developer_info="FE | 안성진" />
        </div>
      </div>
    </div>
  );
};

export default Developers;
