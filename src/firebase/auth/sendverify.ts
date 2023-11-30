import { sendEmailVerification, User } from "firebase/auth";

const sendverify = async (user: User) => {
  await sendEmailVerification(user);
};

export { sendverify };
