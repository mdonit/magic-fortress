"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@styles/nav.module.css";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";

const Navigation = () => {
  const [openMobileLinks, setOpenMobileLinks] = useState<boolean>(false);
  const [openMobileAuth, setOpenMobileAuth] = useState<boolean>(false);

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
      <nav className={styles.nav}>
        <div>
          <Image priority src="/logo.jpg" alt="me" width="40" height="40" className={styles["nav__site-icon"]} draggable="false" onContextMenu={(e) => e.preventDefault()} />
        </div>

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
      </nav>
    </>
  );
};

export default Navigation;
