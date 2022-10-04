// component
import NFTCard from "./NFTCard";
// css
import styles from "../Welcome.module.css";
// img
import yellow_cloud from "../../../assets/welcome/page2_cloud1.svg";
import white_cloud from "../../../assets/welcome/page2_cloud2.svg";
import pink_cloud from "../../../assets/welcome/page2_cloud3.svg";
import dog from "../../../assets/nft-img/1.png";
import cat from "../../../assets/nft-img/2.png";
import giraffe from "../../../assets/nft-img/3.png";
import lion from "../../../assets/nft-img/4.png";
import rabbit from "../../../assets/nft-img/5.png";
import sheep from "../../../assets/nft-img/6.png";
import airplane from "../../../assets/welcome/airplane.svg";

const WelcomePageTwo = ({ storyRef }: any) => {
  return (
    <div id="1" className={styles.welcomePageTwo} ref={storyRef}>
      <img className={styles.page2_cloud1} src={yellow_cloud} alt="" />
      <img className={styles.page2_cloud2} src={white_cloud} alt="" />
      <img className={styles.page2_cloud3} src={pink_cloud} alt="" />

      <h1 className={styles.WelcomeTitleText}>나만의 NFT를 만들어보세요!</h1>
      <h4 className={styles.WelcomeDescriptionText}>
        게임을 통해 그림을 그린 뒤 내가 그린 그림 NFT화가 가능해요!
      </h4>

      <div className={styles.NFTCardSlider}>
        <div className={styles.NFTCardRotate}>
          <NFTCard
            img={dog}
            name="Dog"
            creater="피자먹는 방태"
            owner="치킨먹는 방태"
          />
          <NFTCard
            img={cat}
            name="Cat"
            creater="피자먹는 고양이"
            owner="치킨먹는 고양이"
          />
          <NFTCard
            img={giraffe}
            name="Giraffe"
            creater="피자먹는 기린"
            owner="치킨먹는 기린"
          />
          <NFTCard
            img={lion}
            name="Lion"
            creater="피자먹는 라이언"
            owner="치킨먹는 라이언"
          />
          <NFTCard
            img={rabbit}
            name="Rabbit"
            creater="피자먹는 토끼"
            owner="치킨먹는 토끼"
          />
          <NFTCard
            img={sheep}
            name="Sheep"
            creater="피자먹는 양"
            owner="치킨먹는 양"
          />
        </div>
      </div>

      <img className={styles.airplane} src={airplane} alt="airplane" />
    </div>
  );
};

export default WelcomePageTwo;
