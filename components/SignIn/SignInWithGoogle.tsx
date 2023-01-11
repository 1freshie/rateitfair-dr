import { useRouter } from 'next/router';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { signInWithGoogle } from '../../context/auth-context';

export default function SignInWithGoogle() {
  const router = useRouter();

  const handleSignIn = async () => {
    await signInWithGoogle();
    router.push('/');
  };

  return (
    <button
      onClick={handleSignIn}
      className="w-full button-blue bg-background--white text-secondary--gray border border-secondary--gray hover:bg-background--white hover:text-primary--blue hover:border-primary--blue flex items-center justify-center gap-3 duration-300"
    >
      <FontAwesomeIcon icon={faGoogle} width={30} height={30} />
      <p>Google</p>
    </button>
  );
};