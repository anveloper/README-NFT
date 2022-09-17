import React from "react";
import styles from "./Modal.module.css";

export const Modal = (props: any) => {
  const { open, close, header, fn } = props;

  return (
    <div
      className={
        open ? `${styles.openModal} ${styles.modal}` : `${styles.modal}`
      }
    >
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className={styles.clBtn} onClick={close}>
              취소
            </button>
            <button className={styles.scBtn} onClick={fn}>
              확인
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};
