"use client";
// import AuthOptions from "@components/AuthOptions";
import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { signout } from "@firebase/auth/signout";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import AuthModal from "./AuthModal";
import styles from "@styles/nav.module.css";
import Image from "next/image";
import { BiUpArrow } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import PlayerSelection from "./PlayerSelection";

const Navigation = () => {
  // const [modalAuthVisible, setModalAuthVisible] = useState<boolean>(false);
  // const [modalConfirmVisible, setModalConfirmVisible] = useState<boolean>(false);
  // const [modalVerifyVisible, setModalVerifyVisible] = useState<boolean>(false);
  // const [isLogin, setIsLogin] = useState<boolean>(false);

  const [openMobileLinks, setOpenMobileLinks] = useState<boolean>(false);
  const [openMobileAuth, setOpenMobileAuth] = useState<boolean>(false);

  // const toggleAuthModal = (login?: boolean) => {
  //   login ? setIsLogin(true) : setIsLogin(false);
  //   setModalAuthVisible((prev) => !prev);

  //   if (openMobileAuth) setOpenMobileAuth(false);
  // };
  // const toggleConfirmModal = () => {
  //   setModalConfirmVisible((prev) => !prev);
  // };
  // const toggleVerifyModal = () => {
  //   setModalVerifyVisible((prev) => !prev);
  // };

  // const sendVerifyEmail = () => {
  //   setModalVerifyVisible(true);
  //   setOpenMobileAuth(false);
  // };

  // const userSignOut = () => {
  //   signout();
  //   setModalConfirmVisible(false);
  // };

  const pathname = usePathname();

  const mobileNavHandler = (isLinks: boolean) => {
    if (isLinks) {
      setOpenMobileLinks((prev) => !prev);
      setOpenMobileAuth(false);
    } else {
      setOpenMobileAuth((prev) => !prev);
      setOpenMobileLinks(false);
    }
  };

  return (
    <>
      {/* {modalVerifyVisible && (
        <ConfirmModal yesOrNo={false} text={"Verification email has been sent; Don't forget to refresh the page after verification is complete!"} toggleModal={toggleVerifyModal} />
      )}
      {modalConfirmVisible && <ConfirmModal yesOrNo={true} text={"Are you sure you want to sign out?"} func={userSignOut} toggleModal={toggleConfirmModal} />}
      {modalAuthVisible && <AuthModal toggleModal={toggleAuthModal} isLogin={isLogin} />} */}
      <nav className={styles.nav}>
        <div>
          <Image priority src="/logo.jpg" alt="me" width="40" height="40" className={styles["nav__site-icon"]} draggable="false" onContextMenu={(e) => e.preventDefault()} />
        </div>
        {/* <div className={`${styles["nav--mobile"]} ${openMobileLinks && styles["nav--mobile--open"]}`}>
          <BiUpArrow size={45} className={styles["nav--mobile__icon"]} onClick={() => mobileNavHandler(true)} />
        </div> */}

        <div className={`${styles["nav--mobile__links"]} ${openMobileLinks && styles["nav--mobile--window-open"]}`}>
          <ul>
            <li className={`link ${pathname === "/" ? styles["nav-link--active"] : ""}`}>
              <Link
                href="/"
                onClick={() => {
                  openMobileLinks && mobileNavHandler(true);
                }}
              >
                Home
              </Link>
            </li>
            <li className={`link ${pathname.startsWith("/dnd") ? styles["nav-link--active"] : ""}`}>
              <Link
                href="/games"
                onClick={() => {
                  openMobileLinks && mobileNavHandler(true);
                }}
              >
                Games
              </Link>
            </li>
          </ul>
        </div>
        <div></div>
        <div className={`${styles["nav--mobile"]} ${openMobileAuth && styles["nav--mobile--open"]}`}>
          <GiHamburgerMenu size={45} className={styles["nav--mobile__icon"]} onClick={() => mobileNavHandler(true)} />
        </div>
        {/* <div className={`${styles["nav--mobile__auth"]} ${openMobileAuth && styles["nav--mobile--window-open"]}`}>
          <div className={styles["auth-buttons"]}>
            <AuthOptions toggleAuthModal={toggleAuthModal} toggleConfirmModal={toggleConfirmModal} mobileNavHandler={mobileNavHandler} sendVerifyEmail={sendVerifyEmail} />
          </div>
          <PlayerSelection />
        </div> */}
      </nav>
    </>
  );
};

export default Navigation;
