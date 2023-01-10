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
      className="input flex items-center justify-center gap-3 text-secondary--gray duration-300 hover:text-primary--blue"
    >
      <FontAwesomeIcon icon={faGoogle} width={30} height={30} />
      <p className="paragraph text-secondary--gray">Google</p>
    </button>
  );
};