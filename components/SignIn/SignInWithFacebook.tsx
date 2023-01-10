import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

import { signInWithFacebook } from "../../context/auth-context";

export default function SignInWithFacebook() {
  const router = useRouter();

  const handleSignIn = async () => {
    await signInWithFacebook();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignIn}
      className="input flex items-center justify-center gap-3 text-secondary--gray duration-300 hover:text-primary--blue"
    >
      <FontAwesomeIcon icon={faFacebook} width={30} height={30} />
      <p className="paragraph text-secondary--gray">Facebook</p>
    </button>
  );
}
