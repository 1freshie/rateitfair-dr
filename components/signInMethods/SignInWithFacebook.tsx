import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../../firebaseApp";

export default function SignInWithFacebook() {
  // const [signInWithFacebook, userFacebook, loadingFacebook, errorFacebook] =
  //   useSignInWithFacebook(auth);

  const router = useRouter();

  const facebookProvider = new FacebookAuthProvider();

  async function handleSignInWithFacebook() {
    const signInResult = await signInWithPopup(auth, facebookProvider);

    const { uid, displayName, email, photoURL } = signInResult.user;

    const userDoc = doc(db, "users", uid);

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
          ratedProductsCount: 0,
        });
      } catch (error: any) {
        prompt("Error", error.message);
      }
    }
    router.push("/");
  }

  return (
    <button
      onClick={handleSignInWithFacebook}
      className="w-full button-blue bg-background--white text-secondary--gray border border-secondary--gray hover:bg-background--white hover:text-primary--blue hover:border-primary--blue flex items-center justify-center gap-3 duration-300 font-normal"
    >
      <FontAwesomeIcon icon={faFacebook} width={30} height={30} />
      <p>Facebook</p>
    </button>
  );
}
