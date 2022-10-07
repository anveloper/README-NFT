// img
import loadingImg from "assets/loading/loading_page.gif";
// css
import styles from "./Loading.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingItemsCenter}>
        <img className={styles.loadingImg} src={loadingImg} alt="" />
        <h4 className={styles.loadingText}>
          메타마스크 팝업창을 확인해주세요!
        </h4>
      </div>
    </div>
  );
};

export default LoadingPage;
