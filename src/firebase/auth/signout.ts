import { firebaseAuth } from "@firebase/config";
import { signOut } from "firebase/auth";

const signout = async () => {
  let error: unknown = null;

  try {
    await signOut(firebaseAuth).then(() => {
      // console.log("sign out successful");
    });
  } catch (e) {
    error = e;
  }

  return { error };
};

export { signout };
