import { signInWithRedirect, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from '../firebase/firebaseApp';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProvider);
};

export const signOutUser = async () => {
  await signOut(auth);
};