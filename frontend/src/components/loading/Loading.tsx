import React from "react";

import styles from "./Loading.module.css";
interface Props {
  status: "idle" | "loading" | "failed";
}
const Loading = ({ status }: Props) => {
  const disable = status === "loading";
  return (
    <>
      {disable ? (
        <div className={styles.container}>
          <div>로딩중</div>
        </div>
      ) : null}
      ;
    </>
  );
};

export default Loading;
