import React from "react";
import styles from "./Modal.module.css";

export const Modal = (props: any) => {
  const { open, close, header, fn, cancel, confirm } = props;

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
              {cancel}
            </button>
            <button className={styles.scBtn} onClick={fn}>
              {confirm}
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

Modal.defaultProps = {
  cancel: "취소",
  confirm: "확인",
};
