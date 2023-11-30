import { firebaseAuth } from "@firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const signup = async (name: string, email: string, password: string) => {
  let error: unknown = null;
  let errorMessage: string = "";
  let uid: string = "";

  await createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      uid = user.uid;

      await updateProfile(user, { displayName: name });
    })
    .catch((authError: Error) => {
      error = authError;
      errorMessage = authError.message.substring(authError.message.lastIndexOf("("));
    });
  return { error, errorMessage, uid };
};

export { signup };
