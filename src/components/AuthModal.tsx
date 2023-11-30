"use client";
import { signin } from "@firebase/auth/signin";
import { signup } from "@firebase/auth/signup";
import { signout } from "@firebase/auth/signout";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "@styles/modal.module.css";
import { addToNames, getFromNames } from "@firebase/player-group";

type ToggleModal = {
  toggleModal: () => void;
  isLogin: boolean;
};

type InputInvalid = {
  isInvalid: boolean;
  message: string;
  css: string;
};

const inputInvalidInitial: InputInvalid[] = [
  { isInvalid: false, message: "Four characters at least, please", css: "error-msg" },
  { isInvalid: false, message: "Display Name already exists", css: "error-msg--name-taken" },
  { isInvalid: false, message: "Email already registered", css: "error-msg--email" },
  { isInvalid: false, message: "Passwords do not match", css: "error-msg--password-match" },
  { isInvalid: false, message: "Wrong email or password", css: "error-msg--email" },
  { isInvalid: false, message: "Password should be at least 6 characters", css: "error-msg--password-weak" },
];

const nameReg = /^.{4,}/;

const AuthModal = ({ toggleModal, isLogin }: ToggleModal) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [nameInvalid, setNameInvalid] = useState<InputInvalid>(inputInvalidInitial[0]);
  const [emailInvalid, setEmailInvalid] = useState<InputInvalid>(inputInvalidInitial[2]);
  const [passwordInvalid, setPasswordInvalid] = useState<InputInvalid>(inputInvalidInitial[3]);
  const [loginInvalid, setLoginInvalid] = useState<InputInvalid>(inputInvalidInitial[4]);

  const router = useRouter();
  const currentPath = usePathname();

  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLogin) {
      const { error, errorMessage } = await signin(email, password);

      if (error) {
        if (errorMessage === "(auth/invalid-login-credentials).") {
          setLoginInvalid((prev) => ({ ...prev, isInvalid: true }));
        }

        return;
      }
    } else {
      if (!name.match(nameReg)) {
        setNameInvalid(inputInvalidInitial[0]);
        setNameInvalid((prev) => ({ ...prev, isInvalid: true }));
        return;
      }

      const nameTaken = (await getFromNames()).docs.find((n) => n.data().displayName === name);
      if (nameTaken) {
        setNameInvalid(inputInvalidInitial[1]);
        setNameInvalid((prev) => ({ ...prev, isInvalid: true }));
        return;
      }

      if (password !== passwordConfirm) {
        setPasswordInvalid(inputInvalidInitial[3]);
        setPasswordInvalid((prev) => ({ ...prev, isInvalid: true }));
        return;
      }
      const { error, errorMessage, uid } = await signup(name, email, password);

      if (error) {
        if (errorMessage === "(auth/email-already-in-use).") {
          setEmailInvalid((prev) => ({ ...prev, isInvalid: true }));
        }
        if (errorMessage === "(auth/weak-password).") {
          setPasswordInvalid(inputInvalidInitial[5]);
          setPasswordInvalid((prev) => ({ ...prev, isInvalid: true }));
        }

        return;
      } else {
        addToNames(name, uid);
      }
    }

    router.push(currentPath);

    toggleModal();
  };

  return (
    <div className={styles.modal}>
      <div className={`${styles.form} ${!isLogin ? styles["form--auth-signup"] : styles["form--auth-login"]}`}>
        <h3>{!isLogin ? "Sign Up" : "Login"}</h3>
        <form onSubmit={handleForm}>
          {!isLogin && (
            <label htmlFor="name">
              <span>Display Name </span>
              <input
                className={nameInvalid.isInvalid ? styles["form--invalid"] : ""}
                onChange={(e) => {
                  setName(e.target.value.trim());
                  setNameInvalid((prev) => ({ ...prev, isInvalid: false }));
                }}
                type="text"
                name="name"
                id="name"
                placeholder="Example_Name09"
                required
              />
              {nameInvalid.isInvalid && <p className={styles[nameInvalid.css]}>{nameInvalid.message}</p>}
            </label>
          )}
          <label htmlFor="email">
            <span>Email </span>
            <input
              className={emailInvalid.isInvalid || loginInvalid.isInvalid ? styles["form--invalid"] : ""}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailInvalid((prev) => ({ ...prev, isInvalid: false }));
              }}
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              required
            />
            {emailInvalid.isInvalid && <p className={styles[emailInvalid.css]}>{emailInvalid.message}</p>}
          </label>
          <label htmlFor="password">
            <span>Password </span>
            <input
              className={passwordInvalid.isInvalid || loginInvalid.isInvalid ? styles["form--invalid"] : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                !isLogin ? setPasswordInvalid((prev) => ({ ...prev, isInvalid: false })) : setLoginInvalid((prev) => ({ ...prev, isInvalid: false }));
              }}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
            {passwordInvalid.isInvalid && <p className={styles[passwordInvalid.css]}>{passwordInvalid.message}</p>}
            {loginInvalid.isInvalid && <p className={styles[loginInvalid.css]}>{loginInvalid.message}</p>}
          </label>
          {!isLogin && (
            <label htmlFor="confirmPassword">
              <span>Confirm Password </span>
              <input
                className={passwordInvalid.isInvalid ? styles["form--invalid"] : ""}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  setPasswordInvalid((prev) => ({ ...prev, isInvalid: false }));
                }}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                required
              />
            </label>
          )}
          <div className={`${styles["form__buttons"]} ${styles["form__buttons--auth"]}`}>
            <button type="submit">{!isLogin ? "Sign Up" : "Log In"}</button>
            <button onClick={toggleModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
