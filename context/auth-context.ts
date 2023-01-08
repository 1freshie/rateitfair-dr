import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseApp";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  const userRef = collection(db, "users");
  const { uid } = result.user;
  await setDoc(doc(userRef, uid), {
    role: "User",
    orgId: "",
    ratedProducts: [
      {
        productId: "",
        rating: 0,
        comment: "",
      },
    ],
    createdAt: new Date(),
  });
};

export const signInWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
  const userRef = collection(db, "users");
  const { uid } = result.user;
  await setDoc(doc(userRef, uid), {
    role: "User",
    orgId: "",
    ratedProducts: [
      {
        productId: "",
        rating: 0,
        comment: "",
      },
    ],
    createdAt: new Date(),
  });
};

export const signOutUser = async () => {
  await signOut(auth);
};
