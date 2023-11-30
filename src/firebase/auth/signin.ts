import { firebaseAuth } from "@firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

const signin = async (email: string, password: string) => {
  let error: unknown = null;
  let errorMessage: string = "";

  await signInWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
    })
    .catch((authError: Error) => {
      error = authError;
      errorMessage = authError.message.substring(authError.message.lastIndexOf("("));
    });

  return { error, errorMessage };
};

export { signin };
