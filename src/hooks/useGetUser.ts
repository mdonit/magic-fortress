import { User, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseAuth } from "@firebase/config";

type CurrentUser = {
  user: User | null;
  loggedIn: boolean;
};

const initialValue = {
  user: null,
  loggedIn: false,
};

export const useGetUser = () => {
  const [authUser, setAuthUser] = useState<CurrentUser>(initialValue);

  useEffect(() => {
    const listen = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuthUser({ user: user, loggedIn: true });
      } else {
        setAuthUser({ user: null, loggedIn: false });
      }
    });
    return () => {
      listen();
    };
  }, []);

  return authUser;
};
