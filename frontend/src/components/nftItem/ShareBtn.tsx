import React, { MouseEvent } from "react";
import { Metadata } from "features/nft/nftSlice";

import { RiKakaoTalkFill } from "react-icons/ri";
import styles from "./NftItem.module.css";
interface ShareBtnProps {
  tokenId: number;
  metadata: Metadata;
}
const ShareBtn = ({ tokenId, metadata }: ShareBtnProps) => {
  const handleShare = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const targetUrl = `http://[도메인]/readme/${tokenId}/`;
    if (window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        kakao.init(process.env.REACT_APP_KAKAO_KEY);
      }
      console.log("LINK: ", targetUrl);
      console.log("IMG: ", metadata.imageURL);
      kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: `README - NFT[${metadata.name}]`,
          description: "#리드미 #README #내마음을읽어줘",
          imageUrl: metadata.imageURL,
          link: {
            mobileWebUrl: targetUrl,
            webUrl: targetUrl,
          },
        },
        // social: {
        //   likeCount: 77,
        //   commentCount: 55,
        //   sharedCount: 333,
        // },
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: targetUrl,
              webUrl: targetUrl,
            },
          },
        ],
      });
    }
  };

  return (
    <button className={styles.shareBtn} onClick={handleShare}>
      공유하기
      <RiKakaoTalkFill width={20} height={20} />
    </button>
  );
};

export default ShareBtn;
