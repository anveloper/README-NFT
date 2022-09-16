// css
import styles from "../Welcome.module.css";
import RoadMapImg from "./RoadMapImg";

const RoadMap = () => {
  return (
    <div className={styles.RoadMap}>
      <h2>README, 개발 목표는요!</h2>
      <RoadMapImg />
    </div>
  );
};

export default RoadMap;
