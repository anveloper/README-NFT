// img
import road_sign from "../../../assets/road_sign.svg";
import road from "../../../assets/road.svg";
import car from "../../../assets/car.svg";

// css
import styles from "../Welcome.module.css";

const RoadMapImg = () => {
  return (
    <div className={styles.RoadMapImg}>
      <div className={styles.RoadMapSigns}>
        <div className={styles.RoadMapSign}>
          <img className={styles.RoadMapSignImg} src={road_sign} alt="" />
          <h3 className={styles.RoadMapPercent}>100%</h3>
          <p className={styles.RoadMapGoal}>추가 기능 구현</p>
        </div>

        <div className={styles.RoadMapSign}>
          <img className={styles.RoadMapSignImg} src={road_sign} alt="" />
          <h3 className={styles.RoadMapPercent}>75%</h3>
          <p className={styles.RoadMapGoal}>리드미 NFT 발급</p>
        </div>

        <div className={styles.RoadMapSign}>
          <img className={styles.RoadMapSignImg} src={road_sign} alt="" />
          <h3 className={styles.RoadMapPercent}>50%</h3>
          <p className={styles.RoadMapGoal}>리드미 라이브 대회</p>
        </div>

        <div className={styles.RoadMapSign}>
          <img className={styles.RoadMapSignImg} src={road_sign} alt="" />
          <h3 className={styles.RoadMapPercent}>25%</h3>
          <p className={styles.RoadMapGoal}>펜 색상 추가</p>
        </div>
      </div>

      <div className={styles.RoadMapPosition}>
        <img className={styles.RoadMapRoad} src={road} alt="" />
        <img className={styles.RoadMapCar} src={car} alt="" />
      </div>
    </div>
  );
};

export default RoadMapImg;
