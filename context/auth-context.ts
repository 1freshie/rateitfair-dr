import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseApp";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const { uid, displayName, email, photoURL } = result.user;

  const usersCollection = collection(db, "users");

  const userDoc = doc(usersCollection, uid);

  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    try {
      await setDoc(userDoc, {
        id: uid,
        username: displayName,
        email: email,
        photoURL: photoURL,
        role: "User",
        orgId: "",
        // ratedProducts: [
          // {
          //   productId: "",
          //   rating: 0,
          //   comment: "",
          //   ratedAt: new Date(),
          // },
        // ],
        ratedProductsCount: 0,
        // createdAt: new Date(),
      });
    } catch (error: any) {
      prompt("Error", error.message);
    }
  }
}

export async function signInWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  const { uid, displayName, email, photoURL } = result.user;

  const usersCollection = collection(db, "users");

  const userDoc = doc(usersCollection, uid);

  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    try {
      await setDoc(userDoc, {
        id: uid,
        username: displayName,
        email: email,
        photoURL: photoURL,
        role: "User",
        orgId: "",
        // ratedProducts: [
          // {
          //   productId: "",
          //   rating: 0,
          //   comment: "",
          //   ratedAt: new Date(),
          // },
        // ],
        ratedProductsCount: 0,
        // createdAt: new Date(),
      });
    } catch (error: any) {
      prompt("Error", error.message);
    }
  }
}

export async function signOutUser() {
  await signOut(auth);
}
