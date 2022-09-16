// img
import developer_frame from "../../../assets/developer_frame.svg";

// css
import styles from "../Welcome.module.css";

interface Developer {
  developer_img: string;
  developer_info: string;
}

const DeveloperInfo = ({ developer_img, developer_info }: Developer) => {
  return (
    <div className={styles.DeveloperInfo}>
      <div className={styles.DeveloperImgInfo}>
        <img className={styles.DeveloperFrame} src={developer_frame} alt="" />
        <img className={styles.DeveloperImg} src={developer_img} alt="" />
      </div>

      <h5>{developer_info}</h5>
    </div>
  );
};

export default DeveloperInfo;
