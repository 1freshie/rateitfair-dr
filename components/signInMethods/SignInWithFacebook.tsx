import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useSignInWithFacebook } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseApp";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";

export default function SignInWithFacebook() {
  const [signInWithFacebook, userFacebook, loadingFacebook, errorFacebook] =
    useSignInWithFacebook(auth);

  const router = useRouter();

  async function handleSignInWithFacebook() {
    await signInWithFacebook();
    router.push("/");
  }

  if (loadingFacebook) {
    return <LoadingState />;
  }

  if (errorFacebook) {
    return (
      <ErrorState error={errorFacebook.message} code={errorFacebook.code} />
    );
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
