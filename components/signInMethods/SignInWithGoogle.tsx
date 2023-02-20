import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";

import { auth, db } from "../../firebaseApp";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";

export default function SignInWithGoogle() {
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);

  const router = useRouter();

  function handleSignInWithGoogle() {
    signInWithGoogle();
    router.push("/");
  }

  const userDoc = userGoogle && doc(db, "users", userGoogle.user.uid);

  const [userSnapshot, loadingUserDoc, errorUserDoc] = useDocument(userDoc);

  useEffect(() => {
    if (
      userGoogle &&
      userDoc &&
      userSnapshot &&
      !userSnapshot.exists() &&
      !loadingUserDoc
    ) {
      try {
        setDoc(userDoc, {
          id: userGoogle.user.uid,
          username: userGoogle.user.displayName,
          email: userGoogle.user.email,
          photoURL: userGoogle.user.photoURL,
          role: "User",
          orgId: "",
          ratedProductsCount: 0,
        });
      } catch (error: any) {
        prompt("Error", error.message);
      }
    }
  }, [userGoogle, userDoc, userSnapshot, loadingUserDoc]);

  if (loadingGoogle || loadingUserDoc) {
    return <LoadingState />;
  }

  if (errorGoogle) {
    return <ErrorState error={errorGoogle.message} code={errorGoogle.code} />;
  }

  if (errorUserDoc) {
    return <ErrorState error={errorUserDoc.message} code={errorUserDoc.code} />;
  }

  return (
    <button
      onClick={handleSignInWithGoogle}
      className="w-full button-blue bg-background--white text-secondary--gray border border-secondary--gray hover:bg-background--white hover:text-primary--blue hover:border-primary--blue flex items-center justify-center gap-3 duration-300 font-normal"
    >
      <FontAwesomeIcon icon={faGoogle} width={30} height={30} />
      <p>Google</p>
    </button>
  );
}