"use client";

import { firebaseAuth } from "@firebase/config";
import { GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";

const containerId = "firebase-auth-container";
const ui = new firebaseui.auth.AuthUI(firebaseAuth);
const uiConfig: firebaseui.auth.Config = {
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  signInSuccessUrl: "/dashboard",
};

const FirebaseAuthUI = (): JSX.Element => {
  useEffect(() => {
    ui.start(`#${containerId}`, uiConfig);
  }, []);

  return <div id={containerId}></div>;
};

export { FirebaseAuthUI };
