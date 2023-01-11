import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseApp";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const { uid, displayName, email, photoURL } = result.user;

  const usersCollection = collection(db, "users");

  await setDoc(doc(usersCollection, uid), {
    id: uid,
    username: displayName,
    email: email,
    photoURL: photoURL,
    role: "User",
    orgId: "",
    ratedProducts: [
      {
        productId: "",
        rating: 0,
        comment: "",
      },
    ],
    ratedProductsCount: 0,
    createdAt: new Date(),
  });
}

export async function signInWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  const { uid, displayName, email, photoURL } = result.user;

  const usersCollection = collection(db, "users");

  await setDoc(doc(usersCollection, uid), {
    id: uid,
    username: displayName,
    email: email,
    photoURL: photoURL,
    role: "User",
    orgId: "",
    ratedProducts: [
      {
        productId: "",
        rating: 0,
        comment: "",
      },
    ],
    ratedProductsCount: 0,
    createdAt: new Date(),
  });
}

export async function signOutUser() {
  await signOut(auth);
}
