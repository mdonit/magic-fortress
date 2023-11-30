import { useGetUser } from "@hooks/useGetUser";
import styles from "@styles/nav.module.css";
import { sendverify } from "@firebase/auth/sendverify";

type ToggleModal = {
  toggleAuthModal: (login?: boolean) => void;
  toggleConfirmModal: () => void;
  mobileNavHandler: (isLinks: boolean) => void;
  sendVerifyEmail: () => void;
};

const AuthOptions = ({ toggleAuthModal, toggleConfirmModal, mobileNavHandler, sendVerifyEmail }: ToggleModal) => {
  const authUser = useGetUser();

  const handleSendVerifyEmail = () => {
    authUser.user && sendverify(authUser.user);
    sendVerifyEmail();
  };

  return (
    <>
      {authUser.loggedIn ? (
        <>
          <div>
            <span className={styles["display-name"]}>{authUser.user?.displayName}</span>
            <span
              className={styles["auth-button"]}
              onClick={() => {
                mobileNavHandler(false);
                toggleConfirmModal();
              }}
            >
              Sign Out
            </span>
          </div>
        </>
      ) : (
        <div>
          <span className={styles["auth-button"]} onClick={() => toggleAuthModal(false)}>
            Sign Up
          </span>
          <span className={styles["auth-button"]} onClick={() => toggleAuthModal(true)}>
            Log in
          </span>
        </div>
      )}
      {authUser.loggedIn && !authUser.user?.emailVerified && (
        <div className={styles["verify-button"]}>
          <span onClick={handleSendVerifyEmail}>Send Verify Email</span>
        </div>
      )}
    </>
  );
};

export default AuthOptions;
