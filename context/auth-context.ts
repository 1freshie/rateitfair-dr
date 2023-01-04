import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from "firebase/auth";
import { auth } from '../firebase/firebaseApp';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = async () => {
  await signInWithPopup(auth, facebookProvider);
};

export const signOutUser = async () => {
  await signOut(auth);
};