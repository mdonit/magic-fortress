import React from "react";
import styles from "@styles/footer.module.css";

const FooterContent = () => {
  return (
    <div className={styles.footer}>
      <div className={styles["footer-top"]}>
        <span>Magic Fortress</span>
        {/* <span>Made with Next.js</span> */}
        {/* <span>
          <a href="https://github.com/mdonit/doniblog" target="_blank">
            Github Link
          </a>
        </span> */}
      </div>
      <span className={styles["footer-bottom"]}>Copyright &copy; Donát Maráki. All Rights Reserved</span>
    </div>
  );
};

export default FooterContent;
