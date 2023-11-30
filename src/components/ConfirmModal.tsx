"use client";
import styles from "@styles/modal.module.css";

type ConfirmWindow = {
  yesOrNo: boolean;
  text: string;
  func?: () => void;
  toggleModal: () => void;
};

const ConfirmModal = ({ yesOrNo, text, func, toggleModal: toggleConfirmModal }: ConfirmWindow) => {
  return (
    <div className={styles.modal}>
      <div className={`${styles.form} ${styles["form--confirm"]}`}>
        <h3>Confirmation</h3>
        <div>
          <p>{text}</p>
        </div>
        {yesOrNo ? (
          <div className={styles["form__buttons"]}>
            <button onClick={func}>Yes</button>
            <button onClick={toggleConfirmModal}>Cancel</button>
          </div>
        ) : (
          <div className={styles["form__buttons"]}>
            <button onClick={toggleConfirmModal}>Ok</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
